from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from typing import List
from app.crud import friends as friends_crud
from app.schemas.friendship import FriendshipCreate, FriendshipResponse

router = APIRouter(
    prefix="/friendships",
    tags=["friendships"]
)

@router.post("/", response_model=FriendshipResponse)
def create_friendship(
    friendship: FriendshipCreate, 
    db: Session = Depends(get_db)
):
    return friends_crud.create_friendship(db=db, friendship=friendship)

@router.get("/", response_model=List[FriendshipResponse])
def list_friendships(
    user_id: int,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    friendships = friends_crud.list_friendships(db, user_id=user_id,skip=skip, limit=limit)
    return friendships