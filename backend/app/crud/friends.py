from sqlalchemy.orm import Session, joinedload
from app.schemas.friendship import FriendshipCreate, FriendshipResponse
from app.models.friendship import Friendship as FriendshipModel
import datetime
from typing import List, Dict

def create_friendship(db: Session, friendship: FriendshipCreate) -> FriendshipResponse:
    db_friendship = FriendshipModel(
        user_id=friendship.user_id,
        friend_id=friendship.friend_id,
        created_at=datetime.datetime.now(),
    )
    reverse_friendship = FriendshipModel(
        user_id=friendship.friend_id,
        friend_id=friendship.user_id,
        created_at=datetime.datetime.now(),
    )
    db.add(reverse_friendship)
    db.commit()
    db.refresh(reverse_friendship)
    db.add(db_friendship)
    db.commit()
    db.refresh(db_friendship)
    return db_friendship

def list_friendships(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[FriendshipResponse]:
    return db.query(FriendshipModel).filter(FriendshipModel.user_id == user_id).offset(skip).limit(limit).all()