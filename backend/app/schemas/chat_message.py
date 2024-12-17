from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ChatMessageBase(BaseModel):
    content: str
    session_id: int

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(ChatMessageBase):
    id: int
    sender_id: int
    sender_username: str = Field(description="The sender's full name, or username if full name is not available")
    timestamp: datetime

    class Config:
        from_attributes = True 