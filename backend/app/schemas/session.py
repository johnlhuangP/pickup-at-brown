from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class SessionBase(BaseModel):
    title: str
    description: Optional[str] = None
    location_id: int
    datetime: datetime
    max_participants: int
    sport_id: int

class SessionCreate(SessionBase):
    pass

class SessionUpdate(SessionBase):
    title: Optional[str] = None
    description: Optional[str] = None
    location_id: Optional[int] = None
    datetime: Optional[datetime] = None
    max_participants: Optional[int] = None
    sport_id: Optional[int] = None

class SessionResponse(SessionBase):
    id: int
    creator_id: int

    class Config:
        from_attributes = True 