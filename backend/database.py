from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Default to sqlite for local dev if Postgres is not provided yet, but user asked for Postgres.
# We will assume a default or env var.
# For now, put a placeholder or use sqlite for non-blocking dev.
# Use absolute path to ensure we always use the same DB file regardless of CWD
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
print(f"DEBUG: database.py BASE_DIR: {BASE_DIR}")
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'sql_app.db')}")
print(f"DEBUG: Using DB URL: {SQLALCHEMY_DATABASE_URL}")
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
