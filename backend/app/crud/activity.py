from sqlalchemy.orm import Session
from app.models.activity import Activity, ActivityType
import json

def create_activity(
    db: Session,
    user_id: int,
    activity_type: ActivityType,
    session_id: int = None,
    message_id: int = None,
    metadata: dict = None
):
    db_activity = Activity(
        user_id=user_id,
        activity_type=activity_type,
        session_id=session_id,
        message_id=message_id,
        metadata=json.dumps(metadata) if metadata else None
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def get_user_activities(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100
):
    return db.query(Activity)\
        .filter(Activity.user_id == user_id)\
        .order_by(Activity.timestamp.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_session_activities(
    db: Session,
    session_id: int,
    skip: int = 0,
    limit: int = 100
):
    return db.query(Activity)\
        .filter(Activity.session_id == session_id)\
        .order_by(Activity.timestamp.desc())\
        .offset(skip)\
        .limit(limit)\
        .all() 