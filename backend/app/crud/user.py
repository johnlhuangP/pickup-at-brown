from sqlalchemy.orm import Session, joinedload
from app.models.user import User
from app.models.sport_preference import SportPreference
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.crud.sport import get_sport_from_name
from datetime import datetime

def get_user(db: Session, user_id: int):
    return db.query(User)\
        .options(joinedload(User.sport_preferences).joinedload(SportPreference.sport))\
        .filter(User.id == user_id)\
        .first()
def get_user_by_clerk_id(db: Session, clerk_id: str):
    return db.query(User)\
        .options(joinedload(User.sport_preferences).joinedload(SportPreference.sport))\
        .filter(User.clerk_id == clerk_id)\
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
        raise ValueError("Username already exists")
        
    # Check if email exists
    if db.query(User).filter(User.email == user.email).first():
        raise ValueError("Email already exists")

    # Create the user
    db_user = User(
        email=user.email,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        bio=user.bio if hasattr(user, 'bio') else None,
        clerk_id=user.clerk_id,
        skill_level=user.skill_level,
        user_profile_created=user.user_profile_created,
    )
    db.add(db_user)
    db.flush()

    # Handle sport preferences
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
        if var == 'sport_preferences':
            if value is not None:
                # Update sport preferences
                update_sport_preferences(db, db_user, value)
        else:
            if value is not None:
                setattr(db_user, var, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user
def update_sport_preferences(db: Session, db_user: User, new_preferences: list):
    # Get current sport preferences
    old_preferences = set()
    for pref in db_user.sport_preferences:
        sport_id = get_sport_from_name(db, pref.sport_name)
        if not sport_id:
            continue
        old_preferences.add(sport_id.id)

    # Create a set of new sport IDs
    new_pref = set()
    for pref in new_preferences:
        sport_id = get_sport_from_name(db, pref.sport_name)
        if not sport_id:
            continue
        new_pref.add(sport_id.id)
    
    # Delete old preferences that are not in the new list
    for sport_id in list(old_preferences):
        if sport_id not in new_pref:
            sport_pref = db.query(SportPreference)\
                .filter(SportPreference.user_id == db_user.id)\
                .filter(SportPreference.sport_id == sport_id)\
                .first()
            db.delete(sport_pref)
            db.commit()
    
    # Add new preferences that are not already associated with the user
    for sport_id in list(new_pref):
        if sport_id not in old_preferences:
            new_pref = SportPreference(user_id=db_user.id, sport_id=sport_id, skill_level="beginner", notification_enabled=True, created_at=datetime.utcnow())
            db.add(new_pref)
    
    db.commit()

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True 

def get_user_profile(db: Session, clerk_id: str):
    """
    Get complete user profile with all related data
    """
    return db.query(User)\
        .options(
            joinedload(User.sport_preferences)
            .joinedload(SportPreference.sport)
        )\
        .filter(User.clerk_id == clerk_id)\
        .first() 