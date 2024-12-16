import React, { useState, useEffect, useRef } from "react";
import styles from "./sessionDetail.module.css";
import { useWebSocket } from "../contexts/WebSocketContext";
import { API_BASE_URL } from "../config";

interface SessionDetailProps {
  sessionId: number;
  isParticipant: boolean;
  currentUserId: number;
  session: any;
  onClose: () => void;
  onJoin?: () => void;
  onLeave?: () => void;
}

const SessionDetail: React.FC<SessionDetailProps> = ({
  sessionId,
  isParticipant,
  currentUserId,
  session,
  onClose,
  onJoin,
  onLeave,
}) => {
  const [message, setMessage] = useState("");
  const { messages, sendMessage, connected, setMessages } = useWebSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // Remove auto-scroll effect
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/chat/session/${sessionId}`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [sessionId, setMessages]);

  const handleSendMessage = () => {
    if (message.trim() && connected && isParticipant) {
      sendMessage(message);
      setMessage("");
      // Only scroll to bottom when sending a new message
      scrollToBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format time
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format date based on when it is
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${time}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${time}`;
    } else {
      return `${date.toLocaleDateString()} at ${time}`;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log("isParticipant", isParticipant);
  console.log("currentUserId", currentUserId);
  return (
    <div className={styles.detailContainer}>
      {/* Session Info Section */}
      <div className={styles.sessionInfo}>
        <div className={styles.infoHeader}>
          <div className={styles.titleSection}>
            <h3>{session.title}</h3>
            <span className={styles.datetime}>
              {formatDateTime(session.datetime)}
            </span>
          </div>
          {!isParticipant ? (
            <button className={styles.joinButton} onClick={onJoin}>
              Join Session
            </button>
          ) : (
            <button className={styles.leaveButton} onClick={onLeave}>
              Leave Session
            </button>
          )}
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Sport</span>
            <span>{session.sport.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Location</span>
            <span>{session.location.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Date & Time</span>
            <span>{new Date(session.datetime).toLocaleString()}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Participants</span>
            <span>
              {session.current_participants} / {session.max_participants}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Host</span>
            <span>{session.creator.username}</span>
          </div>
          {session.description && (
            <div className={styles.description}>
              <span className={styles.label}>Description</span>
              <p>{session.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Section - Now visible to everyone */}
      <div className={styles.chatSection}>
        <div className={styles.messages}>
          {isLoadingMessages ? (
            <div className={styles.loading}>Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className={styles.noMessages}>No messages yet</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  msg.sender_id === Number(currentUserId)
                    ? styles.myMessage
                    : styles.otherMessage
                }`}
              >
                <div className={styles.messageHeader}>
                  <span className={styles.senderName}>
                    {msg.sender_username}
                  </span>
                  <span className={styles.timestamp}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className={styles.messageContent}>{msg.content}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.chatInput}>
          {!isParticipant ? (
            <div className={styles.joinPrompt}>
              Join this session to participate in the chat
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!connected || !isParticipant}
              />
              <button
                onClick={handleSendMessage}
                disabled={!connected || !isParticipant || !message.trim()}
                className={styles.sendButton}
              >
                Send
              </button>
            </>
          )}
          {!connected && isParticipant && (
            <div className={styles.connectionStatus}>Connecting to chat...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
