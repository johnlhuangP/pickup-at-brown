import React from "react";
import styles from "./session.module.css";
import { FiClock, FiUser } from "react-icons/fi";

interface SessionProps {
  id: number;
  title: string;
  description?: string;
  datetime: string;
  creator: { id: number; username: string; full_name?: string } | null;
  sport: { id: number; name: string };
  location: { id: number; name: string };
  max_participants: number;
  current_participants: number;
  onJoin?: () => void;
  onLeave?: () => void;
  isParticipant?: boolean;
}

const Session: React.FC<SessionProps> = ({
  title,
  datetime,
  creator,
  sport,
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    
    // Format date
    const dateFormatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    // Format time
    const timeFormatted = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className={styles.datetime}>
        <span className={styles.date}>{dateFormatted}</span>
        <span className={styles.time}>{timeFormatted}</span>
      </div>
    );
  };

  return (
    <div className={styles.sessionCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.sportBadge}>{sport.name}</span>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <FiClock className={styles.icon} />
          {formatDateTime(datetime)}
        </div>
        <div className={styles.detail}>
          <FiUser className={styles.icon} />
          <span>{creator?.full_name || creator?.username || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};

export default Session;
