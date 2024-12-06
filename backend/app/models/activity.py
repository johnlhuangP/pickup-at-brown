from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message_id = Column(Integer, ForeignKey("chat_messages.id"))
    session_id = Column(Integer, ForeignKey("sessions.id"))
    timestamp = Column(DateTime)
    activity_type = Column(String)  # e.g., "join_session", "send_message", etc.

    user = relationship("User", back_populates="activities")
    message = relationship("ChatMessage", back_populates="activities")
    session = relationship("Session", back_populates="activities")  # This needs a matching relationship in Session