
from sqlmodel import create_engine
import os

# Prefer env var; ensure SSL if using Supabase
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/mydb")

engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
)
