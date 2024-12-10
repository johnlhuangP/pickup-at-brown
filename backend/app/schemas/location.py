from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class LocationBase(BaseModel):
    name: str
    sport_ids: List[int]

class LocationCreate(LocationBase):
    pass

class LocationUpdate(LocationBase):
    name: Optional[str] = None
    sport_ids: Optional[List[int]] = None

class LocationResponse(LocationBase):
    id: int
    # Assuming you want to track who created the location
    creator_id: Optional[int] = None
    
    # Optional additional response fields
    total_blocked_times: Optional[int] = 0
    current_availability: Optional[bool] = True

    class Config:
        from_attributes = True  # Allows ORM model conversion