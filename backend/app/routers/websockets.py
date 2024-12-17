from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.websockets.connection_manager import manager
from app.crud import chat_message as crud_chat, user as crud_user
from app.schemas.chat_message import ChatMessageCreate
from app.database import get_db
from sqlalchemy.orm import Session
from typing import Optional
import json

router = APIRouter()

@router.websocket("/ws/{session_id}/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    print(f"WebSocket connection attempt - session: {session_id}, user: {user_id}")
    await manager.connect(websocket, session_id, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Get user info
            user = crud_user.get_user(db, user_id)
            if not user:
                continue

            # Create and save the message
            chat_message = ChatMessageCreate(
                content=message_data["content"],
                session_id=session_id
            )
            db_message = crud_chat.create_message(db, chat_message, user_id)
            
            # Prepare the response with sender info
            response = {
                "type": "chat_message",
                "message": {
                    "id": db_message.id,
                    "content": db_message.content,
                    "sender_id": user_id,
                    "sender_username": user.full_name or user.username,
                    "timestamp": db_message.timestamp.isoformat(),
                    "session_id": session_id
                }
            }
            
            # Broadcast to all users in the session
            await manager.broadcast_to_session(response, session_id)
            
    except WebSocketDisconnect:
        await manager.disconnect(websocket, session_id)
        # Optionally notify others that user has left
        await manager.broadcast_to_session(
            {
                "type": "user_disconnect",
                "user_id": user_id
            },
            session_id
        ) 