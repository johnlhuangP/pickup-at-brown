import React, { useEffect, useState } from 'react';
import "./pastsession.css";
import Session from './Session'; // Import the Session component
import { useUser } from '@clerk/clerk-react';

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
interface PastSessionsProps {
    creator_id: number;
}
const PastSessions = ({creator_id} : PastSessionsProps) => {
    const [sessions, setSessions] = useState<SessionData[]>([]); // Store session data
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error handling state
    const { user, isLoaded, isSignedIn } = useUser();

    // Fetch session data based on the selected sport
    useEffect(() => {
        if (!user) return;
        setLoading(true);
        setError(null);

        // Determine the URL based on the selected sport
        const url = `http://127.0.0.1:8000/sessions/${creator_id}/session-history`; // Filter by sport

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
    }, [creator_id]); // Fetch sessions whenever selectedSport changes

    return (
        <div>
            <h1>Past Sessions</h1>
            <div className="feed">
                {sessions.length == 0 ? <div> <h3>No past sessions</h3></div> : null}
                {sessions.map((session) => (
                    <Session key={session.id} session={session} /> // Pass the session data to the Session component
                ))}
            </div>
        </div>
    );
};
export default PastSessions