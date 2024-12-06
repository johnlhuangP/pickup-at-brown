from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.models.session import SportType, DifficultyLevel

class SessionBase(BaseModel):
    title: str
    sport_type: SportType
    difficulty_level: DifficultyLevel
    location: str
    start_time: datetime
    end_time: datetime
    max_participants: int
    description: Optional[str] = None

class SessionCreate(SessionBase):
    creator_id: int

class SessionUpdate(BaseModel):
    title: Optional[str] = None
    sport_type: Optional[SportType] = None
    difficulty_level: Optional[DifficultyLevel] = None
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    max_participants: Optional[int] = None
    description: Optional[str] = None

class SessionResponse(SessionBase):
    id: int
    creator_id: int
    created_at: datetime
    current_participants: int = 0

    class Config:
        from_attributes = True 