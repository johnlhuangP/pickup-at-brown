from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy import ForeignKey

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    # each location has a list of sports that can be played there
    sport_id1 = Column(Integer, ForeignKey('sports.id'), nullable=True)
    sport_id2 = Column(Integer, ForeignKey('sports.id'), nullable=True)
    sport_id3 = Column(Integer, ForeignKey('sports.id'), nullable=True)
    sport_id4 = Column(Integer, ForeignKey('sports.id'), nullable=True)
    sport_id5 = Column(Integer, ForeignKey('sports.id'), nullable=True)

    
    # Relationships
    sessions = relationship("Session", back_populates="location")
    blocked_times = relationship("BlockedTime", back_populates="location")
    #occupancy history optional for now