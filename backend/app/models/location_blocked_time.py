from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class BlockedTime(Base):
    """
    Stores blocked time slots for each location.
    These could be from pre-booked sessions or other reservations.
    """
    __tablename__ = 'blocked_times'

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey('locations.id'))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    
    # Indicates the source of the block (e.g., web scraper, manual booking)
    source = Column(String, nullable=True)
    
    # Relationship back to the location
    location = relationship("Location", back_populates="blocked_times")
    session = relationship("Session", back_populates="blocked_times")