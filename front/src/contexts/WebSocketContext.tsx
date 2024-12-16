import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { WS_BASE_URL } from '../config';

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_username: string;
  timestamp: string;
  session_id: number;
}

interface WebSocketContextType {
  messages: Message[];
  sendMessage: (content: string) => void;
  connected: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{
  sessionId: number;
  userId: number;
  children: React.ReactNode;
}> = ({ sessionId, userId, children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const wsUrl = `${WS_BASE_URL}/ws/${sessionId}/${userId}`;
    console.log('Connecting to WebSocket:', wsUrl);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected successfully');
      setConnected(true);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setConnected(false);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat_message") {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [sessionId, userId]);

  const sendMessage = (content: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ content }));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ messages, sendMessage, connected, setMessages }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
