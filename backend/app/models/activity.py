from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class ActivityType(str, enum.Enum):
    CREATE_SESSION = "create_session"
    JOIN_SESSION = "join_session"
    LEAVE_SESSION = "leave_session"
    SEND_MESSAGE = "send_message"
    UPDATE_PROFILE = "update_profile"
    CANCEL_SESSION = "cancel_session"
    RATE_SESSION = "rate_session"
    UPDATE_SESSION = "update_session"

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    activity_type = Column(Enum(ActivityType))
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Reference IDs for different types of activities
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True)
    message_id = Column(Integer, ForeignKey("chat_messages.id"), nullable=True)
    
    # Changed 'metadata' to 'activity_metadata' to avoid conflict
    activity_metadata = Column(String, nullable=True)  # For storing additional context as JSON

    # Relationships
    user = relationship("User", back_populates="activities")
    session = relationship("Session", back_populates="activities")
    message = relationship("ChatMessage", back_populates="activities") 