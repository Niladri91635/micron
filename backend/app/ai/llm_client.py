"""
llm_client.py — Singleton OpenAI-compatible client for xAI Grok.

xAI's API is fully OpenAI-compatible.  We simply point the `openai` SDK
at https://api.x.ai/v1 and use the grok-* model names.

Swapping to OpenAI or another provider later = change base_url + model name.
"""

from openai import AsyncOpenAI
from functools import lru_cache
from app.database.database import settings


# ─────────────────────────────────────────────────────────────────────────────
# Supported Grok models (latest first)
# ─────────────────────────────────────────────────────────────────────────────
GROK_MODELS = {
    "default": "openai/gpt-oss-120b",   # primary model
    "fast":    "openai/gpt-oss-120b",   # alias — swap to a smaller model if needed
    "powerful": "openai/gpt-oss-120b",  # alias — used for re-ranking in Milestone 5
}


@lru_cache(maxsize=1)
def get_grok_client() -> AsyncOpenAI:
    """
    Return a lazily-initialised, cached AsyncOpenAI client pointed at xAI.
    Called once on first request — not at import time (avoids startup errors
    if XAI_API_KEY is not yet set during testing / local dev without the key).
    """
    if not settings.XAI_API_KEY:
        raise RuntimeError(
            "XAI_API_KEY is not set. "
            "Add it to backend/.env as:  XAI_API_KEY=xai-your-key-here"
        )
    return AsyncOpenAI(
        api_key=settings.XAI_API_KEY,
        base_url="https://api.x.ai/v1",
    )
