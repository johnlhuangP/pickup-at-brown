import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import styles from './userSessions.module.css';

interface UserSessionsProps {
  creator_id: number;
}

interface Session {
  id: number;
  title: string;
  datetime: string;
  sport: {
    name: string;
  };
  location: {
    name: string;
  };
}

const UserSessions: React.FC<UserSessionsProps> = ({ creator_id }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserSessions = async () => {
      if (!creator_id) return;

      try {
        // Fetch all sessions where the user is a participant
        const response = await fetch(`${API_BASE_URL}/sessions/user/${creator_id}/all`);
        if (!response.ok) throw new Error('Failed to fetch sessions');
        const data = await response.json();
        
        // Sort sessions by date (most recent first)
        const sortedSessions = data.sort((a: Session, b: Session) => 
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
        
        setSessions(sortedSessions);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSessions();
  }, [creator_id]);

  if (loading) {
    return <div className={styles.loading}>Loading sessions...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (sessions.length === 0) {
    return <div className={styles.empty}>No sessions found.</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className={styles.pastSessions}>
      {sessions.map((session) => (
        <div 
          key={session.id} 
          className={`${styles.sessionCard} ${isUpcoming(session.datetime) ? styles.upcomingSession : ''}`}
        >
          <h4 className={styles.title}>{session.title}</h4>
          <div className={styles.badges}>
            <span className={styles.sportBadge}>{session.sport.name}</span>
            <span className={`${styles.statusBadge} ${isUpcoming(session.datetime) ? styles.upcoming : styles.past}`}>
              {isUpcoming(session.datetime) ? 'Upcoming' : 'Past'}
            </span>
          </div>
          <div className={styles.details}>
            <div className={styles.detail}>
              <span className={styles.label}>Location</span>
              <span className={styles.value}>{session.location.name}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Date</span>
              <span className={styles.value}>{formatDate(session.datetime)}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Time</span>
              <span className={styles.value}>{formatTime(session.datetime)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserSessions;