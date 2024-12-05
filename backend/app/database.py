import os
from dotenv import load_dotenv
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging
from app.config import settings

load_dotenv()

# Get database credentials
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')

# Construct database URL
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

try:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True  # Add connection testing
    )
    # Test the connection
    with engine.connect() as conn:
        pass
except Exception as e:
    logging.error(f"Database connection failed: {e}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Import all models here
from app.models.user import User
from app.models.session import Session
from app.models.session_participant import SessionParticipant
from app.models.chat_message import ChatMessage

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()