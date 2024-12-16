export const API_BASE_URL = 'http://127.0.0.1:8000';
export const WS_BASE_URL = 'ws://127.0.0.1:8000';

export const endpoints = {
  sessions: `${API_BASE_URL}/sessions`,
  websocket: (sessionId: number, userId: number) => 
    `${WS_BASE_URL}/ws/${sessionId}/${userId}`,
}; 