#!/usr/bin/env python3
import os
import sys
from sqlmodel import SQLModel, create_engine
from dotenv import load_dotenv

# Ensure backend is importable
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if PROJECT_ROOT not in sys.path:
	sys.path.insert(0, PROJECT_ROOT)

from backend.models import User, Organization, Lead, Agent, Score, Message, Task, LeadEvent, Campaign  # noqa: F401

load_dotenv()


def init_database():
	database_url = os.getenv("DATABASE_URL")
	if not database_url:
		print("DATABASE_URL not found in environment variables")
		sys.exit(1)

	engine = create_engine(database_url)
	SQLModel.metadata.create_all(engine)
	print("Database tables created successfully!")


if __name__ == "__main__":
	init_database()
