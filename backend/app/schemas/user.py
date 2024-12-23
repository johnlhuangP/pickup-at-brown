from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum

class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

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

class UserBase(BaseModel):
    email: EmailStr = Field(
        example="john.doe@brown.edu",
        description="User's email address"
    )
    username: str = Field(
        example="johndoe",
        description="Username for the account"
    )
    first_name: Optional[str] = Field(
        default="",
        example="John",
        description="User's first name"
    )
    last_name: Optional[str] = Field(
        default="",
        example="Doe",
        description="User's last name"
    )

class UserCreate(UserBase):
    supabase_id: str = Field(description="User's Supabase ID")
    bio: Optional[str] = Field(
        default=None,
        example="I love sports!",
        description="User's bio"
    )
    sport_preferences: List[SportPreferenceCreate] = Field(
        default=[],
        example=[
            {
                "sport_name": "Basketball",
                "skill_level": "intermediate",
                "notification_enabled": True
            }
        ],
        description="List of user's sport preferences"
    )

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    sport_preferences: Optional[List[SportPreferenceCreate]] = None

class UserResponse(UserBase):
    id: int
    bio: Optional[str] = None
    sport_preferences: List[SportPreferenceResponse] = []
    supabase_id: str
    full_name: str = ""

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, db_user):
        return cls(
            id=db_user.id,
            email=db_user.email,
            username=db_user.username,
            first_name=db_user.first_name or "",
            last_name=db_user.last_name or "",
            bio=db_user.bio,
            full_name=db_user.full_name if db_user.first_name and db_user.last_name else "",
            supabase_id=db_user.supabase_id,
            sport_preferences=[SportPreferenceResponse.from_orm(pref) for pref in db_user.sport_preferences]
        )

    @property
    def preferred_sports(self):
        return [pref.sport_name for pref in self.sport_preferences]