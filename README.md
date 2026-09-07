# Micron Referral System

AI-powered employee referral and candidate matching platform built for the Micron Hackathon.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Backend | FastAPI (Python) |
| Database | PostgreSQL + pgvector |
| Resume Parsing | PyMuPDF + python-docx |
| AI/Embeddings | LLM + Sentence Transformers |
| Search | PostgreSQL FTS + pgvector ANN |
| Ranking | Rules + Semantic Similarity + LLM Reranking |

## Project Structure

```
micron-referral-system/
├── backend/
│   ├── app/
│   │   ├── main.py              ← FastAPI app entry point
│   │   ├── api/
│   │   │   └── candidates.py   ← Resume upload & analyze endpoints
│   │   ├── ai/
│   │   │   ├── resume_parser.py     ← PDF/DOCX text extraction (Stage 1)
│   │   │   └── profile_extractor.py ← AI/NLP extraction (Stage 2)
│   │   ├── schemas/
│   │   │   └── candidate.py    ← Pydantic models
│   │   ├── models/
│   │   │   └── candidate.py    ← SQLAlchemy ORM (Milestone 3)
│   │   └── database/
│   │       └── database.py     ← DB engine + settings
│   ├── uploads/                ← Uploaded resumes (gitignored)
│   ├── requirements.txt
│   └── .env
├── frontend/
└── README.md
```

## Milestone Roadmap

| # | Goal | Status |
|---|---|---|
| 1 | FastAPI + PDF/DOCX text extraction | ✅ Done |
| 2 | LLM → structured Candidate JSON | 🔜 Next |
| 3 | PostgreSQL + pgvector persistence | ⬜ |
| 4 | Hybrid job matching (FTS + vector) | ⬜ |
| 5 | LLM reranking + scoring | ⬜ |
| 6 | HR Dashboard | ⬜ |

## Quick Start (Milestone 1)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Copy env file
copy .env .env.local

# Run the server
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs for the interactive Swagger UI.

## API Endpoints

### `POST /api/candidates/extract-text`
Upload a PDF or DOCX resume → returns raw extracted text.
Use this to validate extraction before connecting the LLM.

### `POST /api/candidates/analyze`
Upload resume + name/email/phone → returns structured `CandidateProfile` JSON.

### `GET /health`
Health check.
