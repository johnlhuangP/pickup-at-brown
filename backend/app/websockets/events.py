from enum import Enum
from pydantic import BaseModel
from datetime import datetime

class WebSocketEventType(str, Enum):
    CHAT_MESSAGE = "chat_message"
    USER_JOIN = "user_join"
    USER_LEAVE = "user_leave"
    ERROR = "error"

class ChatMessageEvent(BaseModel):
    type: WebSocketEventType = WebSocketEventType.CHAT_MESSAGE
    message: dict

class UserEvent(BaseModel):
    type: WebSocketEventType
    user_id: int
    username: str

class ErrorEvent(BaseModel):
    type: WebSocketEventType = WebSocketEventType.ERROR
    message: str 