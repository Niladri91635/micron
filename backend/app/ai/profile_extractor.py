"""
profile_extractor.py — AI/NLP extraction layer.

Architecture (clean separation of concerns):
  resume_parser.py  →  raw text      (Stage 1 — no AI)
  profile_extractor.py  →  JSON      (Stage 2 — AI/LLM)

This module:
  • Calls the Grok LLM via the OpenAI-compatible xAI API
  • Parses and validates the JSON response
  • Falls back to the regex stub if the LLM call fails
  • Is completely decoupled from HTTP (no FastAPI/UploadFile here)
"""

import json
import logging
import re
from typing import Any

from app.ai.prompts import build_extraction_messages
from app.database.database import settings

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# JSON parsing helpers
# ─────────────────────────────────────────────────────────────────────────────

def _strip_markdown_fences(text: str) -> str:
    """
    Strip markdown code fences that some LLMs add despite being told not to.
    E.g.  ```json ... ```  →  ...
    """
    # Match ```json ... ``` or ``` ... ```
    pattern = r"```(?:json)?\s*([\s\S]*?)\s*```"
    match = re.search(pattern, text)
    if match:
        return match.group(1).strip()
    return text.strip()


def _parse_llm_json(raw_response: str) -> dict[str, Any]:
    """
    Attempt to parse the LLM's raw response as JSON.
    Handles:
      - Clean JSON
      - JSON wrapped in markdown fences
      - Leading/trailing prose (extracts first { ... } block)
    """
    # First: strip fences
    cleaned = _strip_markdown_fences(raw_response)

    # Try direct parse
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Fallback: find the outermost JSON object via brace matching
    start = cleaned.find("{")
    if start != -1:
        depth = 0
        for i, ch in enumerate(cleaned[start:], start=start):
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(cleaned[start : i + 1])
                    except json.JSONDecodeError:
                        break

    raise ValueError(f"Could not extract valid JSON from LLM response:\n{raw_response[:300]}")


def _normalise_profile(data: dict, name: str, email: str, phone: str) -> dict[str, Any]:
    """
    Merge form-submitted contact fields and ensure all schema fields exist
    so the Pydantic CandidateProfile validator doesn't complain.
    """
    # Always use the submitted name/email/phone — don't trust LLM to parse these
    data["name"] = name
    data["email"] = email
    data["phone"] = phone

    # Ensure required top-level fields exist with defaults
    data.setdefault("summary", "")
    data.setdefault("education", [])
    data.setdefault("certifications", [])
    data.setdefault("languages", [])
    data.setdefault("projects", [])

    # Normalise experience block
    exp = data.setdefault("experience", {})
    if isinstance(exp, dict):
        exp.setdefault("total_years", 0.0)
        exp.setdefault("roles", [])
        # Ensure total_years is a float
        try:
            exp["total_years"] = float(exp["total_years"])
        except (TypeError, ValueError):
            exp["total_years"] = 0.0

    # Normalise skills block
    skills = data.setdefault("skills", {})
    if isinstance(skills, dict):
        skills.setdefault("technical", [])
        skills.setdefault("soft", [])
        skills.setdefault("tools", [])

    return data


# ─────────────────────────────────────────────────────────────────────────────
# Milestone 2 — real LLM extraction via xAI Grok
# ─────────────────────────────────────────────────────────────────────────────

async def extract_profile_llm(
    raw_text: str,
    name: str,
    email: str,
    phone: str,
) -> dict[str, Any]:
    """
    Send the raw resume text to Grok and return a validated profile dict.

    Model: settings.XAI_MODEL  (default: grok-3-mini)
    Falls back to the regex stub if the API call or JSON parsing fails.
    """
    from app.ai.llm_client import get_grok_client

    messages = build_extraction_messages(raw_text)

    logger.info("Calling Grok (%s) for resume extraction…", settings.XAI_MODEL)

    client = get_grok_client()

    response = await client.chat.completions.create(
        model=settings.XAI_MODEL,
        messages=messages,
        temperature=0.0,        # deterministic — we want consistent JSON
        max_tokens=2048,
        response_format={"type": "json_object"},   # JSON mode (xAI supports this)
    )

    raw_content = response.choices[0].message.content
    logger.debug("Raw Grok response:\n%s", raw_content)

    extracted = _parse_llm_json(raw_content)
    normalised = _normalise_profile(extracted, name, email, phone)

    logger.info(
        "Grok extraction complete — skills: %d tech, %d soft | experience: %.1f yrs",
        len(normalised.get("skills", {}).get("technical", [])),
        len(normalised.get("skills", {}).get("soft", [])),
        normalised.get("experience", {}).get("total_years", 0),
    )

    return normalised


# ─────────────────────────────────────────────────────────────────────────────
# Milestone 1 — regex stub (kept as fallback)
# ─────────────────────────────────────────────────────────────────────────────

_TECH_KEYWORDS = [
    "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
    "sql", "postgresql", "mysql", "mongodb", "redis", "react", "nextjs",
    "vuejs", "angular", "node", "express", "django", "flask", "fastapi",
    "spring", "docker", "kubernetes", "aws", "gcp", "azure", "linux",
    "git", "machine learning", "deep learning", "nlp", "pytorch",
    "tensorflow", "pandas", "numpy", "scikit-learn",
]
_SOFT_KEYWORDS = [
    "leadership", "communication", "teamwork", "problem solving",
    "critical thinking", "time management", "collaboration", "adaptability",
]


def extract_profile_stub(
    raw_text: str,
    name: str,
    email: str,
    phone: str,
) -> dict[str, Any]:
    """Regex/keyword fallback — used when LLM call fails or XAI_API_KEY is absent."""
    lower = raw_text.lower()
    tech = [k for k in _TECH_KEYWORDS if k in lower]
    soft = [k for k in _SOFT_KEYWORDS if k in lower]
    years_matches = re.findall(r"(\d+)\+?\s*years?", raw_text, re.IGNORECASE)
    total_years = float(max((int(m) for m in years_matches), default=0))
    degrees = ["bachelor", "master", "b.tech", "m.tech", "be", "me", "mca", "bca", "phd"]
    education = [
        {"degree": line.strip(), "field": "", "institution": "", "year": ""}
        for line in raw_text.splitlines()
        if any(d in line.lower() for d in degrees)
    ][:3]
    paragraphs = [p.strip() for p in raw_text.split("\n\n") if len(p.strip()) > 60]

    return {
        "name": name, "email": email, "phone": phone,
        "summary": paragraphs[0] if paragraphs else "",
        "education": education,
        "experience": {"total_years": total_years, "roles": []},
        "skills": {"technical": tech, "soft": soft, "tools": []},
        "projects": [], "certifications": [], "languages": [],
    }


# ─────────────────────────────────────────────────────────────────────────────
# Unified entry point — auto-selects LLM or stub
# ─────────────────────────────────────────────────────────────────────────────

async def extract_profile(
    raw_text: str,
    name: str,
    email: str,
    phone: str,
) -> tuple[dict[str, Any], str]:
    """
    Smart dispatcher:
      • If XAI_API_KEY is set  → calls Grok (Milestone 2)
      • Otherwise              → falls back to regex stub (Milestone 1)

    Returns:
      (profile_dict, extraction_method)
      extraction_method is "llm" or "stub" — useful for logging / debugging.
    """
    if settings.XAI_API_KEY:
        try:
            profile = await extract_profile_llm(raw_text, name, email, phone)
            return profile, "llm"
        except Exception as exc:
            logger.warning(
                "Grok extraction failed (%s). Falling back to regex stub.", exc
            )

    return extract_profile_stub(raw_text, name, email, phone), "stub"
