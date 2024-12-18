from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import session as session_crud
from app.schemas.session import SessionCreate, SessionResponse, SessionUpdate
from typing import List
from app.core.auth_router import AuthRouter
from fastapi import HTTPException
from sqlalchemy.orm import joinedload
from sqlalchemy import or_
from app.models.session import Session as SessionModel
from app.models.session_participant import SessionParticipant

router = AuthRouter(
    prefix="/sessions",
    tags=["sessions"]
)

@router.post("/", response_model=SessionResponse)
def create_session(
    session: SessionCreate, 
    creator_id: int,
    db: Session = Depends(get_db)
):
    return session_crud.create_session(db=db, session=session, creator_id=creator_id)

@router.get("/", response_model=List[SessionResponse])
def list_sessions(
    skip: int = 0, 
    limit: int = 100, 
    sport_type: str = None,
    db: Session = Depends(get_db)
):
    sessions = session_crud.get_sessions(
        db, 
        skip=skip, 
        limit=limit, 
        sport_type=sport_type
    )
    return sessions

@router.get("/{session_id}/participants")
def list_session_participants(session_id: int, db: Session = Depends(get_db)):
    db_session = session_crud.get_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return [participant.user_id for participant in db_session.participants]


@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db)):
    db_session = session_crud.get_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return db_session

@router.put("/{session_id}", response_model=SessionResponse)
def update_session(session_id: int, session: SessionUpdate, db: Session = Depends(get_db)):
    db_session = session_crud.update_session(db, session_id=session_id, session=session)
    if db_session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return db_session

@router.delete("/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)):
    success = session_crud.delete_session(db, session_id=session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session deleted successfully"}

@router.post("/{session_id}/join")
def join_session(session_id: int, user_id: int, db: Session = Depends(get_db)):
    result = session_crud.join_session(db, session_id=session_id, user_id=user_id)
    if not result:
        raise HTTPException(status_code=400, detail="Cannot join session")
    return {"message": "Successfully joined session"}

@router.post("/{session_id}/leave")
def leave_session(session_id: int, user_id: int, db: Session = Depends(get_db)):
    result = session_crud.leave_session(db, session_id=session_id, user_id=user_id)
    if not result:
        raise HTTPException(status_code=400, detail="Cannot leave session")
    return {"message": "Successfully left session"}

@router.get("/{creator_id}/session-history")
def get_session_history(creator_id: int, db: Session = Depends(get_db)):
    sessions = session_crud.get_session_history(db, creator_id=creator_id)
    return sessions

@router.get("/user/{user_id}/all")
async def get_all_user_sessions(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get all sessions (both past and upcoming) where the user is a participant"""
    
    # Get all sessions where the user is either a creator or participant
    sessions = (
        db.query(SessionModel)
        .join(SessionParticipant, SessionModel.id == SessionParticipant.session_id)
        .filter(
            or_(
                SessionModel.creator_id == user_id,
                SessionParticipant.user_id == user_id
            )
        )
        .options(
            joinedload(SessionModel.sport),
            joinedload(SessionModel.location),
            joinedload(SessionModel.creator)
        )
        .distinct()
        .all()
    )
    
    # Format the response
    formatted_sessions = []
    for session in sessions:
        formatted_sessions.append({
            "id": session.id,
            "title": session.title,
            "description": session.description,
            "datetime": session.datetime,
            "sport": {
                "id": session.sport.id,
                "name": session.sport.name
            },
            "location": {
                "id": session.location.id,
                "name": session.location.name
            },
            "creator": {
                "id": session.creator.id,
                "username": session.creator.username,
                "full_name": f"{session.creator.first_name} {session.creator.last_name}"
            }
        })
    
    return formatted_sessions