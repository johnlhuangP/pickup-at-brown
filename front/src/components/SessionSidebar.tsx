import React, { useState, useEffect } from "react";
import styles from "./sessionSidebar.module.css";
import { WebSocketProvider } from "../contexts/WebSocketContext";
import SessionDetail from "./SessionDetail";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "../config";

interface SessionSidebarProps {
  selectedSession: any;
  onClose: () => void;
  currentUser: {
    id: number;
    username: string;
    email: string;
    supabase_id: string;
  } | null;
  onParticipantUpdate: (isJoining: boolean) => void;
}

const SessionSidebar: React.FC<SessionSidebarProps> = ({
  selectedSession,
  onClose,
  currentUser,
  onParticipantUpdate,
}) => {
  const { user } = useAuth();
  const [isParticipant, setIsParticipant] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkParticipation = () => {
      if (!selectedSession.participants || !currentUser) {
        return false;
      }

      const isUserParticipant = selectedSession.participants.some(
        (participant: any) => Number(participant) === Number(currentUser.id)
      );

      return isUserParticipant;
    };

    const result = checkParticipation();
    setIsParticipant(result);
  }, [selectedSession, currentUser]);

  const handleJoin = async () => {
    if (!user || !currentUser) {
      setError("You must be logged in to join a session");
      return;
    }
  
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${selectedSession.id}/join?user_id=${currentUser.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to join session");
      }
  
      setIsParticipant(true);
      setError(null);
      onParticipantUpdate(true);
    } catch (error) {
      // TypeScript error fix: Check if the error is an instance of Error
      if (error instanceof Error) {
        setError(error.message || "Failed to join session");
      } else {
        setError("Failed to join session");
      }
    }
  };
  
  const handleLeave = async () => {
    if (!user || !currentUser) {
      setError("You must be logged in to leave a session");
      return;
    }
  
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${selectedSession.id}/leave?user_id=${currentUser.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to leave session");
      }
  
      setIsParticipant(false);
      setError(null);
      onParticipantUpdate(false);
    } catch (error) {
      // TypeScript error fix: Check if the error is an instance of Error
      if (error instanceof Error) {
        setError(error.message || "Failed to leave session");
      } else {
        setError("Failed to leave session");
      }
    }
  };
  

  if (!user || !currentUser) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.error}>
            Please sign in to view session details
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}
        <WebSocketProvider
          sessionId={selectedSession.id}
          userId={currentUser.id}
        >
          <SessionDetail
            sessionId={selectedSession.id}
            session={selectedSession}
            isParticipant={isParticipant}
            currentUserId={currentUser.id}
            onClose={onClose}
            onJoin={handleJoin}
            onLeave={handleLeave}
          />
        </WebSocketProvider>
      </div>
    </div>
  );
};

export default SessionSidebar;
