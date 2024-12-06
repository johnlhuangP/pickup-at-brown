from sqlalchemy.orm import Session
from app.models.user import User
from app.models.sport_preference import SportPreference
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.crud.sport import get_sport_from_name
from datetime import datetime

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    # Check if username exists
    if db.query(User).filter(User.username == user.username).first():
        raise ValueError("Username already exists")
        
    # Check if email exists
    if db.query(User).filter(User.email == user.email).first():
        raise ValueError("Email already exists")

    # Create the user first
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=user.password,  # Note: Make sure this is properly hashed before storing
    )
    db.add(db_user)
    db.flush()  # This assigns an ID to db_user without committing

    # Check for duplicate sport preferences
    seen_sports = set()
    for pref in user.sport_preferences:
        if pref.sport_name in seen_sports:
            raise ValueError(f"Duplicate sport preference: {pref.sport_name}")
        seen_sports.add(pref.sport_name)
        
        sport = get_sport_from_name(db, pref.sport_name)
        if not sport:
            raise ValueError(f"Sport {pref.sport_name} not found")
            
        sport_pref = SportPreference(
            user_id=db_user.id,
            sport_id=sport.id,
            skill_level=pref.skill_level,
            notification_enabled=pref.notification_enabled,
            created_at=datetime.utcnow()
        )
        db.add(sport_pref)

    db.commit()
    db.refresh(db_user)
    
    return UserResponse.from_orm(db_user)

def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    for var, value in vars(user).items():
        if value is not None:
            setattr(db_user, var, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True 