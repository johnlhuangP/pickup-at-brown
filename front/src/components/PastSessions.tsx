import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

interface PastSessionsProps {
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
  current_participants: number;
  max_participants: number;
}

const PastSessions: React.FC<PastSessionsProps> = ({ creator_id }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPastSessions = async () => {
      if (!creator_id) return;

      try {
        const response = await fetch(`${API_BASE_URL}/sessions/${creator_id}/session-history`);
        if (!response.ok) throw new Error('Failed to fetch past sessions');
        const data = await response.json();
        setSessions(data);
      } catch (err) {
        console.error('Error fetching past sessions:', err);
        setError('Failed to load past sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchPastSessions();
  }, [creator_id]);

  if (loading) {
    return <div>Loading past sessions...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (sessions.length === 0) {
    return <div>No past sessions found.</div>;
  }

  return (
    <div className="past-sessions">
      {sessions.map((session) => (
        <div key={session.id} className="session-card">
          <h4>{session.title}</h4>
          <div className="session-details">
            <p>
              <strong>Sport:</strong> {session.sport.name}
            </p>
            <p>
              <strong>Location:</strong> {session.location.name}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(session.datetime).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong>{' '}
              {new Date(session.datetime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p>
              <strong>Participants:</strong>{' '}
              {session.current_participants} / {session.max_participants}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastSessions;