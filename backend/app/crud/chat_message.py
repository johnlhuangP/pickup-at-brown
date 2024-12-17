from app.models.chat_message import ChatMessage
from app.models.session import Session
from app.schemas.chat_message import ChatMessageCreate
from datetime import datetime
from sqlalchemy.orm import joinedload
from fastapi import HTTPException

def create_message(db, message: ChatMessageCreate, sender_id: int):
    if message.content == "":
        raise HTTPException(status_code=422, detail="Message content cannot be empty")

    session = db.query(Session).filter(Session.id == message.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if sender_id not in [participant.user_id for participant in session.participants]:
        raise HTTPException(status_code=403, detail="User is not a participant")

    db_message = ChatMessage(
        content=message.content,
        session_id=message.session_id,
        sender_id=sender_id,
        timestamp=datetime.utcnow()
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_session_messages(db, session_id: int, skip: int = 0, limit: int = 50):
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = db.query(ChatMessage)\
        .options(joinedload(ChatMessage.sender))\
        .filter(ChatMessage.session_id == session_id)\
        .order_by(ChatMessage.timestamp.asc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    # Transform messages to include sender's full name
    return [{
        "id": msg.id,
        "content": msg.content,
        "session_id": msg.session_id,
        "sender_id": msg.sender_id,
        "sender_username": msg.sender.full_name or msg.sender.username,  # Fall back to username if no full name
        "timestamp": msg.timestamp
    } for msg in messages]

def delete_message(db, message_id: int, user_id: int) -> bool:
    message = db.query(ChatMessage)\
        .filter(ChatMessage.id == message_id, ChatMessage.sender_id == user_id)\
        .first()
    if message:
        db.delete(message)
        db.commit()
        return True
    return False 