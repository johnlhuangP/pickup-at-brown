from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    skill_level = Column(String)
    bio = Column(String, nullable=True)
    
    # Use string references for relationships
    created_sessions = relationship("Session", back_populates="creator")
    session_participants = relationship("SessionParticipant", back_populates="user")
    messages = relationship("ChatMessage", back_populates="sender")
    activities = relationship("Activity", back_populates="user")
    friendships = relationship(
        "Friendship",
        foreign_keys="Friendship.user_id",
        back_populates="user"
    )
    friend_requests = relationship(
        "Friendship",
        foreign_keys="Friendship.friend_id",
        back_populates="friend"
    )