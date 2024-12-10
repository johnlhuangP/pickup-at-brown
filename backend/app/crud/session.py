from sqlalchemy.orm import Session as SQLAlchemySession, joinedload
from app.models.session import Session
from app.models.session_participant import SessionParticipant, ParticipantStatus
from app.schemas.session import SessionCreate, SessionUpdate
from app.models.sport import Sport

def get_session(db: SQLAlchemySession, session_id: int):
    return db.query(Session)\
        .options(
            joinedload(Session.creator),
            joinedload(Session.sport),
            joinedload(Session.location)
        )\
        .filter(Session.id == session_id)\
        .first()

def get_sessions(db: SQLAlchemySession, skip: int = 0, limit: int = 100, sport_type: str = None):
    query = db.query(Session)\
        .options(
            joinedload(Session.creator),
            joinedload(Session.sport),
            joinedload(Session.location)
        ).order_by(Session.datetime.desc())
    if sport_type:
        query = query.join(Session.sport).filter(Sport.name == sport_type)
    return query.offset(skip).limit(limit).all()

def create_session(db: SQLAlchemySession, session: SessionCreate, creator_id: int):
    db_session = Session(
        title=session.title,
        description=session.description,
        location_id=session.location_id,
        datetime=session.datetime,
        max_participants=session.max_participants,
        sport_id=session.sport_id,
        creator_id=creator_id
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    # Reload the session with all relationships
    return get_session(db, db_session.id)

def update_session(db: SQLAlchemySession, session_id: int, session: SessionUpdate):
    db_session = get_session(db, session_id)
    if not db_session:
        return None
    
    for var, value in vars(session).items():
        if value is not None:
            setattr(db_session, var, value)
    
    db.commit()
    db.refresh(db_session)
    return db_session

def delete_session(db: SQLAlchemySession, session_id: int):
    db_session = get_session(db, session_id)
    if not db_session:
        return False
    
    db.delete(db_session)
    db.commit()
    return True

def join_session(db: SQLAlchemySession, session_id: int, user_id: int):
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

def leave_session(db: SQLAlchemySession, session_id: int, user_id: int):
    participant = db.query(SessionParticipant).filter(
        SessionParticipant.session_id == session_id,
        SessionParticipant.user_id == user_id
    ).first()
    
    if not participant:
        return False
        
    db.delete(participant)
    db.commit()
    return True 