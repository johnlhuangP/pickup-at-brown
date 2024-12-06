from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class ParticipantStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    DECLINED = "declined"

class SessionParticipant(Base):
    __tablename__ = "session_participants"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(ParticipantStatus), default=ParticipantStatus.PENDING)
    joined_at = Column(DateTime, default=datetime.utcnow)

    # Relationships using strings to avoid circular imports
    session = relationship("Session", back_populates="participants")
    user = relationship("User", back_populates="session_participants") 