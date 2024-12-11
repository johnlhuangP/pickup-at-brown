from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserBasic(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

class SportBasic(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class LocationBasic(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

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
    creator: Optional[UserBasic] = None
    sport: Optional[SportBasic] = None
    location: Optional[LocationBasic] = None
    current_participants: int = 0

    class Config:
        from_attributes = True 