"""
Micron Referral System — AI Analyzer Backend
main.py: FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import candidates

app = FastAPI(
    title="Micron Referral System — AI Analyzer",
    description="Resume extraction and candidate profiling API",
    version="0.1.0",
)

# CORS — allow all origins during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────
# Routers
# ──────────────────────────────────
app.include_router(candidates.router, prefix="/api/candidates", tags=["Candidates"])


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Micron AI Analyzer is running 🚀"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
