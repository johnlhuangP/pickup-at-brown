from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from typing import List, Optional
from app.crud import friends as friends_crud
from app.schemas.friendship import FriendshipCreate, FriendshipResponse, FriendshipUpdate

router = APIRouter(
    prefix="/friendships",
    tags=["friendships"]
)

@router.post("/", response_model=FriendshipResponse)
def send_friend_request(
    friendship: FriendshipCreate, 
    db: Session = Depends(get_db)
):
    return friends_crud.send_friend_request(db=db, friendship=friendship)

@router.put("/{friendship_id}", response_model=FriendshipResponse)
def update_friendship_status(
    friendship_id: int, 
    status: FriendshipUpdate, 
    db: Session = Depends(get_db)
):
    return friends_crud.update_friendship_status(db=db, friendship_id=friendship_id, status=status.status)

@router.get("/", response_model=List[FriendshipResponse])
def list_friendships(
    user_id: int, 
    status: Optional[str] = None, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    return friends_crud.list_friendships(db, user_id=user_id, status=status, skip=skip, limit=limit)

@router.delete("/{friend_id}", response_model=dict)
def delete_friend(
    user_id: int,
    friend_id: int,
    db: Session = Depends(get_db)
):
    """
    Endpoint to delete a friendship between the user and a friend.
    """
    from app.crud import friends as friends_crud

    try:
        return friends_crud.delete_friendship(db=db, user_id=user_id, friend_id=friend_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while deleting the friendship.")