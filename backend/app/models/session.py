from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    datetime = Column(DateTime)
    max_participants = Column(Integer)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sport_id = Column(Integer, ForeignKey("sports.id"), nullable=False)

    creator = relationship("User", back_populates="created_sessions")
    participants = relationship("SessionParticipant", back_populates="session")
    messages = relationship("ChatMessage", back_populates="session")
    sport = relationship("Sport", back_populates="sessions")
    location = relationship("Location", back_populates="sessions")
    activities = relationship("Activity", back_populates="session")

    @property
    def current_participants(self):
        return len(self.participants)