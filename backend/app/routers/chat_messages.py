from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud import chat_message as crud_chat
from app.schemas.chat_message import ChatMessageCreate, ChatMessageResponse

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

@router.get("/session/{session_id}", response_model=List[ChatMessageResponse])
def get_session_messages(
    session_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get all chat messages for a specific session"""
    messages = crud_chat.get_session_messages(db, session_id, skip, limit)
    return messages

@router.post("/", response_model=ChatMessageResponse)
def create_message(
    message: ChatMessageCreate,
    current_user_id: int,  # You'll get this from auth
    db: Session = Depends(get_db)
):
    """Create a new chat message"""
    return crud_chat.create_message(db, message, current_user_id)

@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    current_user_id: int,  # You'll get this from auth
    db: Session = Depends(get_db)
):
    """Delete a chat message (only allowed for sender)"""
    success = crud_chat.delete_message(db, message_id, current_user_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Message not found or you're not the sender"
        )
    return {"message": "Message deleted successfully"}

@router.get("/session/{session_id}/messages", response_model=List[ChatMessageResponse])
async def get_session_messages(
    session_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get recent messages for a session"""
    messages = crud_chat.get_session_messages(db, session_id, skip=skip, limit=limit)
    return messages 