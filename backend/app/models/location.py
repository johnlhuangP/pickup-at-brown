from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    # each location has a list of sports that can be played there
    

    
    # Relationships
    sessions = relationship("Session", back_populates="location")
    blocked_times = relationship("BlockedTime", back_populates="location")
    #occupancy history optional for now