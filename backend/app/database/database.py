"""
database.py — SQLAlchemy async engine setup (Milestone 3+).

Not used in Milestone 1 — wired in when we add PostgreSQL persistence.
Keeping it here so the project structure is complete from day one.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Reads from environment variables or .env file.
    Pydantic-settings will automatically load .env if python-dotenv is installed.
    """
    # PostgreSQL
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/micron_referral"

    # App
    APP_ENV: str = "development"
    SECRET_KEY: str = "change-me-before-production"

    # LLM (Milestone 2) — xAI Grok
    XAI_API_KEY: str = ""
    XAI_MODEL: str = "openai/gpt-oss-120b"   # Grok model

    # LLM fallbacks (optional)
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # pgvector (Milestone 3)
    PGVECTOR_DIMENSION: int = 768

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

# ──────────────────────────────────────────────────────────────────────────────
# SQLAlchemy async engine — uncomment when adding PostgreSQL in Milestone 3
# ──────────────────────────────────────────────────────────────────────────────
# from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
# from sqlalchemy.orm import DeclarativeBase
#
# engine = create_async_engine(settings.DATABASE_URL, echo=True)
# AsyncSession = async_sessionmaker(engine, expire_on_commit=False)
#
# class Base(DeclarativeBase):
#     pass
#
# async def get_db():
#     async with AsyncSession() as session:
#         yield session
