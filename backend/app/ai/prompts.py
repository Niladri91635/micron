"""
prompts.py — LLM prompt templates for the AI Analyzer.

Keeping prompts in a dedicated module makes them easy to:
  - Version and A/B test
  - Translate / localise
  - Swap between models without touching business logic
"""

# ─────────────────────────────────────────────────────────────────────────────
# System prompt — sets the LLM's role and output contract
# ─────────────────────────────────────────────────────────────────────────────

EXTRACTION_SYSTEM_PROMPT = """
You are an expert AI resume parser for a technical hiring platform.

Your ONLY task is to extract structured data from a raw resume text and return it
as a single, valid JSON object — nothing else, no prose, no markdown fences.

Output schema (all fields are optional — use empty strings / empty arrays if absent):

{
  "summary": "",
  "education": [
    {
      "degree": "",
      "field": "",
      "institution": "",
      "year": ""
    }
  ],
  "experience": {
    "total_years": 0.0,
    "roles": [
      {
        "title": "",
        "company": "",
        "duration": "",
        "responsibilities": []
      }
    ]
  },
  "skills": {
    "technical": [],
    "soft": [],
    "tools": []
  },
  "projects": [
    {
      "title": "",
      "description": "",
      "tech_stack": []
    }
  ],
  "certifications": [],
  "languages": []
}

Rules:
1. Return ONLY the JSON. No markdown, no explanation.
2. total_years must be a float (e.g. 3.5). Estimate from role durations if not stated.
3. technical skills = programming languages, frameworks, libraries, cloud platforms.
4. tools = IDEs, DevOps tools, monitoring tools, databases.
5. soft skills = communication, leadership, problem solving, etc.
6. If a field cannot be determined, use empty string "" or empty array [].
7. Do NOT invent information not present in the text.
""".strip()


# ─────────────────────────────────────────────────────────────────────────────
# User prompt — injects the raw resume text
# ─────────────────────────────────────────────────────────────────────────────

EXTRACTION_USER_PROMPT_TEMPLATE = """
Extract structured candidate data from the following resume text.
Return ONLY a valid JSON object — no prose, no markdown, no code fences.

---RESUME START---
{raw_text}
---RESUME END---
""".strip()


def build_extraction_messages(raw_text: str) -> list[dict]:
    """
    Build the messages array for the OpenAI-compatible chat completion call.
    This format works with xAI Grok, OpenAI GPT, and any compatible API.
    """
    return [
        {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
        {
            "role": "user",
            "content": EXTRACTION_USER_PROMPT_TEMPLATE.format(raw_text=raw_text),
        },
    ]
