from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class UserBase(BaseModel):
    email: EmailStr = Field(
        example="john.doe@brown.edu",
        description="User's email address"
    )
    username: str = Field(
        example="johndoe",
        description="Username for the account"
    )

class SportPreferenceCreate(BaseModel):
    sport_name: str = Field(
        example="Basketball",
        description="Name of the sport"
    )
    skill_level: SkillLevel = Field(
        example=SkillLevel.INTERMEDIATE,
        description="User's skill level in this sport"
    )
    notification_enabled: bool = Field(
        default=True,
        example=True,
        description="Whether to receive notifications for this sport"
    )

class SportPreferenceResponse(BaseModel):
    sport_name: str = Field(description="Name of the sport")
    skill_level: str = Field(description="User's skill level in this sport")
    notification_enabled: bool = Field(description="Whether notifications are enabled")

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, sport_pref):
        return cls(
            sport_name=sport_pref.sport.name,
            skill_level=sport_pref.skill_level,
            notification_enabled=sport_pref.notification_enabled
        )

class UserCreate(UserBase):
    password: str = Field(
        example="securepassword123",
        description="User's password"
    )
    sport_preferences: List[SportPreferenceCreate] = Field(
        default=[],
        example=[
            {
                "sport_name": "Basketball",
                "skill_level": "intermediate",
                "notification_enabled": True
            },
            {
                "sport_name": "Tennis",
                "skill_level": "beginner",
                "notification_enabled": False
            }
        ],
        description="List of user's sport preferences"
    )

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    bio: Optional[str] = None

class UserResponse(UserBase):
    id: int
    bio: Optional[str] = None
    sport_preferences: List[SportPreferenceResponse] = []

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, db_user):
        return cls(
            id=db_user.id,
            email=db_user.email,
            username=db_user.username,
            bio=db_user.bio,
            sport_preferences=[SportPreferenceResponse.from_orm(pref) for pref in db_user.sport_preferences]
        )

    @property
    def preferred_sports(self):
        return [pref.sport_name for pref in self.sport_preferences]