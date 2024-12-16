from fastapi import WebSocket
from typing import Dict, List, Optional
from datetime import datetime

class ConnectionManager:
    def __init__(self):
        # Keep track of active connections per session
        self.active_connections: Dict[int, List[tuple[WebSocket, int]]] = {}

    async def connect(self, websocket: WebSocket, session_id: int, user_id: int):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append((websocket, user_id))

    async def disconnect(self, websocket: WebSocket, session_id: int):
        if session_id in self.active_connections:
            # Find and remove the connection
            self.active_connections[session_id] = [
                conn for conn in self.active_connections[session_id] 
                if conn[0] != websocket
            ]
            # Clean up empty session entries
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]

    async def broadcast_to_session(self, message: dict, session_id: int, exclude_user: Optional[int] = None):
        if session_id in self.active_connections:
            for websocket, user_id in self.active_connections[session_id]:
                if exclude_user is None or user_id != exclude_user:
                    await websocket.send_json(message)

    def get_active_users(self, session_id: int) -> List[int]:
        if session_id in self.active_connections:
            return [user_id for _, user_id in self.active_connections[session_id]]
        return []

manager = ConnectionManager() 