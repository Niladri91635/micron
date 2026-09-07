"""
schemas/candidate.py — Pydantic request/response models for the Candidate pipeline.
"""

from typing import Any
from pydantic import BaseModel, EmailStr, Field


# ──────────────────────────────────────────────────────────────────────────────
# Sub-schemas used inside CandidateProfile
# ──────────────────────────────────────────────────────────────────────────────

class EducationEntry(BaseModel):
    degree: str = ""
    field: str = ""
    institution: str = ""
    year: str = ""


class ExperienceSummary(BaseModel):
    total_years: float = 0.0
    roles: list[dict[str, Any]] = Field(default_factory=list)


class SkillsMap(BaseModel):
    technical: list[str] = Field(default_factory=list)
    soft: list[str] = Field(default_factory=list)
    tools: list[str] = Field(default_factory=list)


class ProjectEntry(BaseModel):
    title: str = ""
    description: str = ""
    tech_stack: list[str] = Field(default_factory=list)


# ──────────────────────────────────────────────────────────────────────────────
# Top-level profile returned by the AI extractor
# ──────────────────────────────────────────────────────────────────────────────

class CandidateProfile(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    summary: str = ""
    education: list[EducationEntry] = Field(default_factory=list)
    experience: ExperienceSummary = Field(default_factory=ExperienceSummary)
    skills: SkillsMap = Field(default_factory=SkillsMap)
    projects: list[ProjectEntry] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)


# ──────────────────────────────────────────────────────────────────────────────
# API response wrappers
# ──────────────────────────────────────────────────────────────────────────────

class ExtractTextResponse(BaseModel):
    """Returned by POST /api/candidates/extract-text (Milestone 1)."""
    filename: str | None
    content_type: str | None
    char_count: int
    extracted_text: str


class AnalyzeResponse(BaseModel):
    """Returned by POST /api/candidates/analyze (Milestone 2)."""
    candidate_id: str = Field(example="CAN-A1B2C3")
    status: str = Field(example="ANALYZED")
    extraction_method: str = Field(
        example="llm",
        description="'llm' = Grok extracted the profile | 'stub' = regex fallback was used",
    )
    raw_text_preview: str = Field(description="First 500 chars of extracted text — for debugging")
    candidate_profile: CandidateProfile
