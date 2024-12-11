# schemas/time_block.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TimeBlockBase(BaseModel):
    start_time: datetime
    end_time: datetime
    source: Optional[str] = None  # e.g., "web_scraper", "user_created"

class TimeBlockCreate(TimeBlockBase):
    pass

class TimeBlockUpdate(TimeBlockBase):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class TimeBlockResponse(TimeBlockBase):
    id: int
    location_id: int

    class Config:
        from_attributes = True