from fastapi import APIRouter, Depends, HTTPException, Body, Request
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud import user as crud_user
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from fastapi.openapi.docs import get_swagger_ui_html
from app.auth.clerk import verify_auth_token

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

example_user = {
    "email": "john.doe@brown.edu",
    "username": "johndoe",
    "password": "securepassword123",
    "sport_preferences": [
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
    ]
}

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate = Body(
    example=example_user
), db: Session = Depends(get_db)):
    try:
        return crud_user.create_user(db=db, user=user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[UserResponse])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud_user.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud_user.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = crud_user.update_user(db, user_id=user_id, user=user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    success = crud_user.delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.post("/sync", response_model=UserResponse)
async def sync_clerk_user(
    request: Request,
    db: Session = Depends(get_db)
):
    # Get user data from Clerk token
    clerk_data = await verify_auth_token(request)
    
    # Check if user exists
    db_user = crud_user.get_user_by_clerk_id(db, clerk_data["sub"])
    
    if not db_user:
        # Create new user if they don't exist
        user_create = UserCreate(
            clerk_id=clerk_data["sub"],
            email=clerk_data["email"],
            username=clerk_data["username"],
        )
        db_user = crud_user.create_user(db, user_create)
    
    return db_user 

@router.get("/{user_id}/profile", response_model=UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """
    Get detailed user profile including:
    - Basic user info
    - Sport preferences
    - Full name
    - Bio
    """
    db_user = crud_user.get_user_profile(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user 