import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "FastAPI Project"
    PROJECT_VERSION: str = "1.0.0"
    POSTGRES_USER: str = os.getenv("DB_USER")
    POSTGRES_PASSWORD: str = os.getenv("DB_PASSWORD")
    POSTGRES_SERVER: str = os.getenv("DB_HOST", "localhost")
    POSTGRES_DB: str = os.getenv("DB_NAME", "fastapi")
    DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"

settings = Settings()
