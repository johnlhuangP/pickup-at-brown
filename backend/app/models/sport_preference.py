from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class SportPreference(Base):
    __tablename__ = "user_sport_preferences"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    sport_id = Column(Integer, ForeignKey("sports.id"), primary_key=True)
    skill_level = Column(String, nullable=False)  # e.g., "beginner", "intermediate", "advanced"
    created_at = Column(DateTime, default=datetime.utcnow)
    notification_enabled = Column(Boolean, default=True)  # to receive notifications for this sport

    # Relationships
    user = relationship("User", back_populates="sport_preferences")
    sport = relationship("Sport", back_populates="user_preferences") 