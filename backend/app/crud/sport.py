from app.models.user import User
from app.models.sport_preference import SportPreference
from app.schemas.user import UserCreate
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.sport import Sport
from app.schemas.sport import SportCreate

def get_sport(db: Session, sport_id: int):
    return db.query(Sport).filter(Sport.id == sport_id).first()

def get_sport_from_name(db: Session, sport_name: str):
    return db.query(Sport).filter(Sport.name == sport_name).first()

def get_sports(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Sport).offset(skip).limit(limit).all()

def create_sport(db: Session, sport_name: str):
    db_sport = Sport(name=sport_name)
    db.add(db_sport)
    db.commit()
    db.refresh(db_sport)
    return db_sport

def get_or_create_sport(db: Session, sport_name: str):
    sport = get_sport_from_name(db, sport_name)
    if not sport:
        sport = Sport(name=sport_name)
        db.add(sport)
        db.commit()
        db.refresh(sport)
    return sport
