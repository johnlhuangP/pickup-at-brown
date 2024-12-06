from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    username: str
    skill_level: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    skill_level: Optional[str] = None
    bio: Optional[str] = None

class UserResponse(UserBase):
    id: int
    bio: Optional[str] = None

    class Config:
        from_attributes = True  # For SQLAlchemy models compatibility 