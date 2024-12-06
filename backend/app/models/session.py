from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class SportType(str, enum.Enum):
    BASKETBALL = "basketball"
    SOCCER = "soccer"
    VOLLEYBALL = "volleyball"
    TENNIS = "tennis"
    FOOTBALL = "football"
    FUTSAL = "futsal"
    PICKLEBALL = "pickleball"
    

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    sport_type = Column(Enum(SportType))
    difficulty_level = Column(Enum(DifficultyLevel))
    location = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    max_participants = Column(Integer)
    creator_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    description = Column(String)
    
    # Relationships
    creator = relationship("User", back_populates="created_sessions")
    participants = relationship("SessionParticipant", back_populates="session")
    chat = relationship("ChatMessage", back_populates="session")
    activities = relationship("Activity", back_populates="session") 