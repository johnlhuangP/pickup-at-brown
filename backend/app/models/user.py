from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
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
    sport_preferences = relationship("SportPreference", back_populates="user")

    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return ""

    @property
    def preferred_sports(self):
        return [pref.sport for pref in self.sport_preferences]