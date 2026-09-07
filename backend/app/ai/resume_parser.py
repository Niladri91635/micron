"""
resume_parser.py — PDF and DOCX text extraction layer.

Purpose:
  Stage 1 of the pipeline.  Completely isolated from the AI layer so we can
  test extraction independently.  If text looks wrong, the bug is HERE — not
  in the LLM.

Supported formats:
  .pdf   → PyMuPDF (fitz)
  .docx  → python-docx

Returns:
  Plain UTF-8 string with whitespace normalised.
"""

import io
import re
from pathlib import Path

from fastapi import UploadFile, HTTPException, status


# ──────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ──────────────────────────────────────────────────────────────────────────────

def _clean(text: str) -> str:
    """Collapse multiple blank lines and strip trailing whitespace per line."""
    lines = [line.rstrip() for line in text.splitlines()]
    # Remove runs of more than 2 consecutive blank lines
    cleaned: list[str] = []
    blank_count = 0
    for line in lines:
        if line == "":
            blank_count += 1
            if blank_count <= 2:
                cleaned.append(line)
        else:
            blank_count = 0
            cleaned.append(line)
    return "\n".join(cleaned).strip()


def _extract_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF using PyMuPDF (fitz)."""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="PyMuPDF is not installed. Run: pip install pymupdf",
        )

    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages: list[str] = []
    for page in doc:
        pages.append(page.get_text("text"))
    doc.close()
    return _clean("\n".join(pages))


def _extract_from_docx(file_bytes: bytes) -> str:
    """Extract text from a DOCX file using python-docx."""
    try:
        from docx import Document
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="python-docx is not installed. Run: pip install python-docx",
        )

    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
    return _clean("\n".join(paragraphs))


# ──────────────────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────────────────

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    # Some browsers send this for .docx
    "application/octet-stream",
}
MAX_FILE_SIZE_MB = 10


async def extract_text_from_upload(resume: UploadFile) -> str:
    """
    Read an UploadFile (.pdf or .docx) and return the extracted plain text.

    Raises HTTPException on:
      - Unsupported file type
      - File too large
      - Corrupt / unparseable file
    """
    filename = resume.filename or ""
    suffix = Path(filename).suffix.lower()

    # ── Validate extension ────────────────────────────────────────────────────
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{suffix}'. Only PDF and DOCX are accepted.",
        )

    # ── Read bytes ────────────────────────────────────────────────────────────
    file_bytes = await resume.read()

    # ── Size guard ────────────────────────────────────────────────────────────
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size {size_mb:.1f} MB exceeds the {MAX_FILE_SIZE_MB} MB limit.",
        )

    # ── Dispatch to the right extractor ──────────────────────────────────────
    try:
        if suffix == ".pdf":
            return _extract_from_pdf(file_bytes)
        else:  # .docx
            return _extract_from_docx(file_bytes)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse '{filename}': {exc}",
        )
