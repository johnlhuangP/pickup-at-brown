from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Sport(Base):
    __tablename__ = "sports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
    # Relationship with users through the association table
    user_preferences = relationship("SportPreference", back_populates="sport")
    
    # Relationship with sessions
    sessions = relationship("Session", back_populates="sport")
    
    # Helper property to easily access users
    @property
    def users(self):
        return [pref.user for pref in self.user_preferences]