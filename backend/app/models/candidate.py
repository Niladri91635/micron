"""
models/candidate.py — SQLAlchemy ORM model for the Candidate table (Milestone 3+).

Not active in Milestone 1.  Added now so the schema is defined early
and we avoid structural refactoring later.
"""

# Uncomment everything below when you migrate to PostgreSQL in Milestone 3.
#
# from datetime import datetime
# from sqlalchemy import String, Float, JSON, DateTime, func
# from sqlalchemy.orm import Mapped, mapped_column
# from app.database.database import Base
#
#
# class Candidate(Base):
#     __tablename__ = "candidates"
#
#     id: Mapped[str] = mapped_column(String(20), primary_key=True)  # e.g. CAN-ABC123
#     name: Mapped[str] = mapped_column(String(255))
#     email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
#     phone: Mapped[str] = mapped_column(String(30))
#     raw_text: Mapped[str] = mapped_column(String)           # full extracted resume text
#     profile_json: Mapped[dict] = mapped_column(JSON)        # CandidateProfile as JSON
#     embedding: Mapped[list[float]] = mapped_column(JSON)    # pgvector replaces this in M3
#     status: Mapped[str] = mapped_column(String(30), default="ANALYZED")
#     created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
#     updated_at: Mapped[datetime] = mapped_column(
#         DateTime, server_default=func.now(), onupdate=func.now()
#     )
