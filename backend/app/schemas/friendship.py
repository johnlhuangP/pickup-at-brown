from pydantic import BaseModel
import datetime
from sqlalchemy.orm import Session
from typing import Optional

class UserBasic(BaseModel):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str

    class Config:
        from_attributes = True

class FriendshipBase(BaseModel):
    user_id: int
    friend_id: int

class FriendshipCreate(FriendshipBase):
    pass

class FriendshipUpdate(FriendshipBase):
    status: str

class FriendshipResponse(FriendshipBase):
    id: int
    user: Optional[UserBasic] = None
    friend: Optional[UserBasic] = None

    status: str

    class Config:
        from_attributes = True  # Allows ORM model conversion