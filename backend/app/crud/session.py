from sqlalchemy.orm import Session
from app.models.session import Session as SessionModel
from app.models.session_participant import SessionParticipant, ParticipantStatus
from app.schemas.session import SessionCreate, SessionUpdate

def get_session(db: Session, session_id: int):
    return db.query(SessionModel).filter(SessionModel.id == session_id).first()

def get_sessions(db: Session, skip: int = 0, limit: int = 100, sport_type: str = None):
    query = db.query(SessionModel)
    if sport_type:
        query = query.filter(SessionModel.sport_type == sport_type)
    return query.offset(skip).limit(limit).all()

def create_session(db: Session, session: SessionCreate):
    db_session = SessionModel(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def update_session(db: Session, session_id: int, session: SessionUpdate):
    db_session = get_session(db, session_id)
    if not db_session:
        return None
    
    for var, value in vars(session).items():
        if value is not None:
            setattr(db_session, var, value)
    
    db.commit()
    db.refresh(db_session)
    return db_session

def delete_session(db: Session, session_id: int):
    db_session = get_session(db, session_id)
    if not db_session:
        return False
    
    db.delete(db_session)
    db.commit()
    return True

def join_session(db: Session, session_id: int, user_id: int):
    # Check if session exists and has space
    session = get_session(db, session_id)
    if not session:
        return False
        
    # Check if user is already in session
    existing = db.query(SessionParticipant).filter(
        SessionParticipant.session_id == session_id,
        SessionParticipant.user_id == user_id
    ).first()
    
    if existing:
        return False
        
    participant = SessionParticipant(
        session_id=session_id,
        user_id=user_id,
        status=ParticipantStatus.CONFIRMED
    )
    db.add(participant)
    db.commit()
    return True

def leave_session(db: Session, session_id: int, user_id: int):
    participant = db.query(SessionParticipant).filter(
        SessionParticipant.session_id == session_id,
        SessionParticipant.user_id == user_id
    ).first()
    
    if not participant:
        return False
        
    db.delete(participant)
    db.commit()
    return True 