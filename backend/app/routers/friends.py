from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from typing import List, Optional
from app.crud import friends as friends_crud
from app.schemas.friendship import FriendshipCreate, FriendshipResponse, FriendshipUpdate
from sqlalchemy import func, and_, or_, not_
from app.models.user import User
from app.models.session import Session
from app.models.session_participant import SessionParticipant
from app.models.sport_preference import SportPreference
from app.models.friendship import Friendship
import random

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

@router.get("/recommended/{user_id}")
async def get_recommended_friends(
    user_id: int,
    db: Session = Depends(get_db),
    limit: int = 3
):
    """Get recommended friends based on similar sport preferences and session history"""
    
    # Get the user's sport preferences
    user_sports = db.query(SportPreference).filter(
        SportPreference.user_id == user_id
    ).all()
    user_sport_ids = [sp.sport_id for sp in user_sports]
    
    # Get sessions the user has participated in
    user_sessions = db.query(Session).join(
        SessionParticipant
    ).filter(
        SessionParticipant.user_id == user_id
    ).all()
    user_session_ids = [s.id for s in user_sessions]
    
    # Get existing friend IDs and users with pending requests (both sender and receiver)
    excluded_users = (
        db.query(User.id).join(
            Friendship,
            or_(
                and_(Friendship.user_id == user_id, Friendship.friend_id == User.id),
                and_(Friendship.friend_id == user_id, Friendship.user_id == User.id)
            )
        ).filter(
            or_(
                Friendship.status == 'accepted',
                Friendship.status == 'pending'
            )
        ).all()
    )
    excluded_ids = [u[0] for u in excluded_users]
    excluded_ids.append(user_id)  # Add current user to exclusion list
    
    # Find users with similar sport preferences or session history
    similar_users = (
        db.query(User)
        .join(SportPreference)
        .join(SessionParticipant, User.id == SessionParticipant.user_id, isouter=True)
        .filter(
            and_(
                User.id.notin_(excluded_ids),  # Exclude friends, pending requests, and current user
                SportPreference.sport_id.in_(user_sport_ids)  # Similar sports
            )
        )
        .group_by(User.id)
        .order_by(func.count(User.id).desc())
        .limit(limit)
        .all()
    )
    
    # Format the response
    recommendations = []
    for user in similar_users:
        # Get the matching sports for this user
        user_preferences = db.query(SportPreference).filter(
            SportPreference.user_id == user.id,
            SportPreference.sport_id.in_(user_sport_ids)
        ).all()
        
        # Get shared sessions count
        shared_sessions = db.query(func.count(SessionParticipant.session_id)).filter(
            and_(
                SessionParticipant.user_id == user.id,
                SessionParticipant.session_id.in_(user_session_ids)
            )
        ).scalar()
        
        matching_sport_details = [
            {
                "sport_name": pref.sport.name,
                "skill_level": pref.skill_level
            }
            for pref in user_preferences
        ]
        
        recommendations.append({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "matching_sports": matching_sport_details,
            "shared_sessions_count": shared_sessions or 0,
        })
    
    # If we don't have enough recommendations, add random users
    if len(recommendations) < limit:
        random_users = (
            db.query(User)
            .filter(
                User.id.notin_(excluded_ids + [r["id"] for r in recommendations])
            )
            .order_by(func.random())
            .limit(limit - len(recommendations))
            .all()
        )
        
        for user in random_users:
            user_preferences = db.query(SportPreference).filter(
                SportPreference.user_id == user.id
            ).all()
            
            sport_details = [
                {
                    "sport_name": pref.sport.name,
                    "skill_level": pref.skill_level
                }
                for pref in user_preferences
            ]
            
            recommendations.append({
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "matching_sports": sport_details,
                "shared_sessions_count": 0,
            })
    
    return recommendations

@router.get("/pending/{user_id}")
async def get_pending_friend_requests(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get all pending friend requests for a user"""
    
    # Get friend requests where the user is the receiver and status is pending
    pending_requests = (
        db.query(Friendship, User)
        .join(User, Friendship.user_id == User.id)  # Join with sender's user info
        .filter(
            Friendship.friend_id == user_id,
            Friendship.status == 'pending'
        )
        .all()
    )
    
    # Format the response
    formatted_requests = []
    for friendship, sender in pending_requests:
        formatted_requests.append({
            "friendship_id": friendship.id,
            "sender": {
                "id": sender.id,
                "username": sender.username,
                "first_name": sender.first_name,
                "last_name": sender.last_name
            },
            "created_at": friendship.created_at
        })
    
    return formatted_requests