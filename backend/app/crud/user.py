from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from datetime import datetime

from app.models.user import User
from app.models.sport import Sport
from app.models.sport_preference import SportPreference
from app.schemas.user import UserCreate, UserUpdate
from app.crud.sport import get_sport_from_name

def get_user(db: Session, user_id: int):
    return db.query(User)\
        .options(joinedload(User.sport_preferences).joinedload(SportPreference.sport))\
        .filter(User.id == user_id)\
        .first()

def get_user_by_supabase_id(db: Session, supabase_id: str):
    return db.query(User)\
        .options(joinedload(User.sport_preferences).joinedload(SportPreference.sport))\
        .filter(User.supabase_id == supabase_id)\
        .first()

def get_user_by_email(db: Session, email: str):
    return db.query(User)\
        .options(joinedload(User.sport_preferences).joinedload(SportPreference.sport))\
        .filter(User.email == email)\
        .first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User)\
        .options(joinedload(User.sport_preferences).joinedload(SportPreference.sport))\
        .offset(skip)\
        .limit(limit)\
        .all()

def create_user(db: Session, user: UserCreate):
    # Check if username exists
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
         
    # Check if email exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    # Create the user
    db_user = User(
        email=user.email,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        bio=user.bio if hasattr(user, 'bio') else None,
        supabase_id=user.supabase_id,
    )
    db.add(db_user)
    db.flush()

    # Handle sport preferences
    seen_sports = set()
    for pref in user.sport_preferences:
        if pref.sport_name in seen_sports:
            raise HTTPException(status_code=400, detail=f"Duplicate sport preference: {pref.sport_name}")
        seen_sports.add(pref.sport_name)
        
        sport = get_sport_from_name(db, pref.sport_name)
        if not sport:
            raise HTTPException(status_code=400, detail=f"Sport {pref.sport_name} not found")
        
        sport_pref = SportPreference(
            user_id=db_user.id,
            sport_id=sport.id,
            skill_level=pref.skill_level,
            notification_enabled=pref.notification_enabled,
            created_at=datetime.utcnow()
        )
        db.add(sport_pref)
    
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database error occurred")

def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user fields
    for field, value in user.dict(exclude_unset=True).items():
        if field != 'sport_preferences' and value is not None:
            setattr(db_user, field, value)

    # Update sport preferences if provided
    if user.sport_preferences:
        # Remove existing preferences
        db.query(SportPreference).filter(SportPreference.user_id == user_id).delete()
        
        # Add new preferences
        for pref in user.sport_preferences:
            sport = get_sport_from_name(db, pref.sport_name)
            if not sport:
                raise HTTPException(status_code=400, detail=f"Sport {pref.sport_name} not found")
            
            sport_pref = SportPreference(
                user_id=user_id,
                sport_id=sport.id,
                skill_level=pref.skill_level,
                notification_enabled=pref.notification_enabled,
                created_at=datetime.utcnow()
            )
            db.add(sport_pref)

    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database error occurred")

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return db_user 