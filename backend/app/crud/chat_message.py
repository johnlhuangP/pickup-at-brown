from sqlalchemy.orm import Session
from app.models.chat_message import ChatMessage
from app.schemas.chat_message import ChatMessageCreate
from datetime import datetime
from sqlalchemy.orm import joinedload

def create_message(db: Session, message: ChatMessageCreate, sender_id: int):
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

def get_session_messages(db: Session, session_id: int, skip: int = 0, limit: int = 50):
    messages = db.query(ChatMessage)\
        .options(joinedload(ChatMessage.sender))\
        .filter(ChatMessage.session_id == session_id)\
        .order_by(ChatMessage.timestamp.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    # Transform messages to include sender_username
    return [{
        "id": msg.id,
        "content": msg.content,
        "session_id": msg.session_id,
        "sender_id": msg.sender_id,
        "sender_username": msg.sender.username,
        "timestamp": msg.timestamp
    } for msg in messages]

def delete_message(db: Session, message_id: int, user_id: int) -> bool:
    message = db.query(ChatMessage)\
        .filter(ChatMessage.id == message_id, ChatMessage.sender_id == user_id)\
        .first()
    if message:
        db.delete(message)
        db.commit()
        return True
    return False 