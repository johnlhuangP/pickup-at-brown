from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.session import Session as SessionModel
from typing import List

router = APIRouter(
    prefix="/sessions",
    tags=["sessions"]
)

@router.get("/")
def list_sessions(db: Session = Depends(get_db)):
    return db.query(SessionModel).all()

@router.get("/{session_id}")
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session 