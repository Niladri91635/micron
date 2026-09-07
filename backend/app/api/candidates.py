"""
candidates.py — Candidate API router (Milestone 2)

Endpoints:
  POST /api/candidates/extract-text   →  Upload resume → return raw extracted text (Stage 1)
  POST /api/candidates/analyze        →  Upload resume → extract text → Grok LLM → Candidate JSON
"""

import logging
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.ai.resume_parser import extract_text_from_upload
from app.ai.profile_extractor import extract_profile
from app.schemas.candidate import (
    ExtractTextResponse,
    AnalyzeResponse,
    CandidateProfile,
)

logger = logging.getLogger(__name__)
router = APIRouter()


# ──────────────────────────────────────────────────────────────────────────────
# Helper: generate a simple candidate ID
# ──────────────────────────────────────────────────────────────────────────────
def _generate_candidate_id() -> str:
    short = str(uuid.uuid4()).split("-")[0].upper()
    return f"CAN-{short}"


# ──────────────────────────────────────────────────────────────────────────────
# POST /api/candidates/extract-text   (Milestone 1 — unchanged)
# ──────────────────────────────────────────────────────────────────────────────
@router.post(
    "/extract-text",
    response_model=ExtractTextResponse,
    summary="Extract raw text from a resume (PDF or DOCX)",
)
async def extract_text(
    resume: UploadFile = File(..., description="Resume file — PDF or DOCX"),
):
    """
    Stage 1 of the pipeline — no AI involved.

    Accepts a PDF or DOCX resume and returns raw extracted text.
    Use this endpoint to verify that the parser works BEFORE testing the LLM.
    """
    extracted = await extract_text_from_upload(resume)

    if not extracted.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Could not extract any text from the uploaded file. "
                   "Ensure it is a valid, non-scanned PDF or DOCX.",
        )

    return ExtractTextResponse(
        filename=resume.filename,
        content_type=resume.content_type,
        char_count=len(extracted),
        extracted_text=extracted,
    )


# ──────────────────────────────────────────────────────────────────────────────
# POST /api/candidates/analyze   (Milestone 2 — Grok LLM active)
# ──────────────────────────────────────────────────────────────────────────────
@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Analyze a resume and return a structured Candidate profile",
)
async def analyze_resume(
    name: str = Form(..., description="Applicant's full name"),
    email: str = Form(..., description="Applicant's email address"),
    phone: str = Form(..., description="Applicant's phone number"),
    resume: UploadFile = File(..., description="Resume file — PDF or DOCX"),
):
    """
    Full Milestone 2 pipeline:

    Stage 1  — Extract raw text from PDF/DOCX  (PyMuPDF / python-docx)
    Stage 2  — Pass text to AI/NLP extractor   (xAI Grok if XAI_API_KEY is set,
                                                 regex stub as fallback)
    Stage 3  — Return structured Candidate JSON

    The `extraction_method` field in the response tells you whether Grok
    or the fallback stub was used — helpful for debugging.
    """
    # ── Stage 1: text extraction ──────────────────────────────────────────────
    logger.info("Resume upload received: %s (%s)", resume.filename, resume.content_type)

    extracted_text = await extract_text_from_upload(resume)

    if not extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Could not extract any text from the uploaded file.",
        )

    logger.info("Extracted %d characters from resume.", len(extracted_text))

    # ── Stage 2: AI extraction (Grok LLM or fallback stub) ───────────────────
    try:
        profile_data, method = await extract_profile(
            raw_text=extracted_text,
            name=name,
            email=email,
            phone=phone,
        )
    except Exception as exc:
        logger.exception("Profile extraction failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI extraction failed: {exc}",
        )

    candidate_id = _generate_candidate_id()

    logger.info(
        "Analysis complete: %s | method=%s | id=%s",
        name, method, candidate_id,
    )

    return AnalyzeResponse(
        candidate_id=candidate_id,
        status="ANALYZED",
        extraction_method=method,
        raw_text_preview=extracted_text[:500] + ("…" if len(extracted_text) > 500 else ""),
        candidate_profile=CandidateProfile(**profile_data),
    )
