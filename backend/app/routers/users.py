from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud import user as crud_user
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from fastapi.openapi.docs import get_swagger_ui_html

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