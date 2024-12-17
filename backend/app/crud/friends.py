from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.schemas.friendship import FriendshipCreate, FriendshipResponse
from app.models.friendship import Friendship as FriendshipModel
import datetime
from typing import List, Dict

def send_friend_request(db: Session, friendship: FriendshipCreate) -> FriendshipResponse:
    existing_request = db.query(FriendshipModel).filter(
        FriendshipModel.user_id == friendship.user_id,
        FriendshipModel.friend_id == friendship.friend_id,
        FriendshipModel.status == "pending"
    ).first()
    if existing_request:
        raise HTTPException(status_code=400, detail="Friend request already sent.")

    db_friendship = FriendshipModel(
        user_id=friendship.user_id,
        friend_id=friendship.friend_id,
        status="pending",
        created_at=datetime.datetime.now(),
    )
    db.add(db_friendship)
    db.commit()
    db.refresh(db_friendship)
    return db_friendship

def update_friendship_status(
    db: Session, friendship_id: int, status: str
) -> FriendshipResponse:
    db_friendship = db.query(FriendshipModel).filter(FriendshipModel.id == friendship_id).first()
    if not db_friendship:
        raise HTTPException(status_code=404, detail="Friendship request not found.")

    if status not in ["accepted", "declined"]:
        raise HTTPException(status_code=400, detail="Invalid status.")

    db_friendship.status = status
    db.commit()
    db.refresh(db_friendship)

    if status == "accepted":
        existing_inverse = db.query(FriendshipModel).filter(
            FriendshipModel.user_id == db_friendship.friend_id,
            FriendshipModel.friend_id == db_friendship.user_id
        ).first()

        if not existing_inverse:
            reverse_friendship = FriendshipModel(
                user_id=db_friendship.friend_id,
                friend_id=db_friendship.user_id,
                status="accepted",
                created_at=datetime.datetime.now(),
            )
            db.add(reverse_friendship)
            db.commit()
            db.refresh(reverse_friendship)

    return db_friendship

def list_friendships(
    db: Session, user_id: int, status: str = None, skip: int = 0, limit: int = 100
) -> List[FriendshipResponse]:
    query = db.query(FriendshipModel).filter(FriendshipModel.user_id == user_id)
    if status:
        query = query.filter(FriendshipModel.status == status)
    return query.offset(skip).limit(limit).all()

def delete_friendship(db: Session, user_id: int, friend_id: int) -> Dict[str, str]:
    """
    Delete a friendship relationship between two users.
    """
    friendship = db.query(FriendshipModel).filter(
        FriendshipModel.user_id == user_id,
        FriendshipModel.friend_id == friend_id,
        FriendshipModel.status == "accepted"
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found.")

    db.delete(friendship)
    db.commit()

    inverse_friendship = db.query(FriendshipModel).filter(
        FriendshipModel.user_id == friend_id,
        FriendshipModel.friend_id == user_id,
        FriendshipModel.status == "accepted"
    ).first()
    
    if inverse_friendship:
        db.delete(inverse_friendship)
        db.commit()

    return {"message": "Friendship deleted successfully."}

# def list_friendships(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[FriendshipResponse]:
#     return db.query(FriendshipModel).filter(FriendshipModel.user_id == user_id).offset(skip).limit(limit).all()