from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class DataSourceType(enum.Enum):
    SESSION = "session"
    SCRAPING = "scraping"
    MANUAL = "manual"

class LocationOccupancy(Base):
    __tablename__ = "location_occupancy"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False, index=True)
    occupancy_count = Column(Integer)  # Number of people
    occupancy_percentage = Column(Float)  # 0-100%
    source_type = Column(Enum(DataSourceType), nullable=False)
    source_id = Column(Integer, ForeignKey("sessions.id"), nullable=True)  # If from a session
    
    # Relationships
    location = relationship("Location", back_populates="occupancy_history")
    session = relationship("Session", back_populates="occupancy_records") 