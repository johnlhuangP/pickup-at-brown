from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    skill_level = Column(String)  # e.g., "beginner", "intermediate", "advanced"
    
    # Relationships
    created_sessions = relationship("Session", back_populates="creator")
    session_participants = relationship("SessionParticipant", back_populates="user")
    messages = relationship("Message", back_populates="sender")