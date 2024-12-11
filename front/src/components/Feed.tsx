import { useState, useEffect } from 'react';
import styles from './feed.module.css'; // Import the CSS module for styling
import Session from './Session'; // Import the Session component

interface FeedProps {
  selectedSport: string; // Selected sport passed as prop from the parent component
}

interface SessionData {
  id: number;
  title: string;
  description: string;
  location_id: number;
  datetime: string;
  max_participants: number;
  sport_id: number;
  creator: { id: number; username: string } | null;
  sport: { id: number; name: string };
  location: { id: number; name: string };
  current_participants: number;
}

const Feed = ({ selectedSport }: FeedProps) => {
  const [sessions, setSessions] = useState<SessionData[]>([]); // Store session data
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling state

  // Fetch session data based on the selected sport
  useEffect(() => {
    if (!selectedSport) return;

    setLoading(true);
    setError(null);

    // Determine the URL based on the selected sport
    const url = selectedSport === 'All Upcoming'
      ? 'http://127.0.0.1:8000/sessions/' // No filter
      : `http://127.0.0.1:8000/sessions/?sport_type=${selectedSport}`; // Filter by sport

    fetch(url) // Fetch data from the backend
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
        return response.json();
      })
      .then((data) => {
        setSessions(data); // Set fetched session data
        setLoading(false);  // Turn off loading after fetch is complete
      })
      .catch((err) => {
        setError(err.message); // Handle any errors during the fetch
        setLoading(false);     // Turn off loading even if there is an error
      });
  }, [selectedSport]); // Fetch sessions whenever selectedSport changes

  // Render loading state
  if (loading) {
    return <div className={styles.loading}>Loading sessions...</div>;
  }

  // Render error state
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Render "No sessions" state if no sessions found
  if (sessions.length === 0) {
    return <div>No sessions available for {selectedSport}</div>;
  }

  return (
    <div className={styles.feed}>
      <h2>{selectedSport ? `Sessions for: ${selectedSport}` : 'Select a sport to view sessions'}</h2>
      {/* Map through sessions and create a Session component for each */}
      {sessions.map((session) => (
        <Session key={session.id} session={session} /> // Pass the session data to the Session component
      ))}
    </div>
  );
};

export default Feed;
