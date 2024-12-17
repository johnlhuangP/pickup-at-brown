import { useState, useEffect } from "react";
import styles from "./feed.module.css";
import Session from "./Session";
import SessionSidebar from "./SessionSidebar";
import { API_BASE_URL } from "../config";
import { useAuth } from "../contexts/AuthContext";
import SessionForm from "./SessionForm";

interface FeedProps {
  selectedSport: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  supabase_id: string;
  sport_preferences: Array<{
    sport_name: string;
    skill_level: string;
    notification_enabled: boolean;
  }>;
}

interface SessionData {
  id: number;
  title: string;
  description: string;
  location_id: number;
  datetime: string;
  max_participants: number;
  sport_id: number;
  participants: Array<{
    id: number;
    username: string;
  }>;
  creator: {
    id: number;
    username: string;
    email: string;
  };
  sport: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
  current_participants: number;
}

const Feed = ({ selectedSport }: FeedProps) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allSessions, setAllSessions] = useState<SessionData[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showHistorical, setShowHistorical] = useState<boolean>(false);

  const isHistoricalSession = (session: SessionData) => {
    const sessionDate = new Date(session.datetime);
    sessionDate.setHours(0, 0, 0, 0); // Reset time to start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    return sessionDate < today;
  };

  // Fetch user data from our backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/users/supabase/${user.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError((err as Error).message);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const fetchSessionParticipants = async (sessionId: number) => {
    try {
      const participantsResponse = await fetch(
        `${API_BASE_URL}/sessions/${sessionId}/participants`
      );
      if (!participantsResponse.ok)
        throw new Error("Failed to fetch participants");
      const participants = await participantsResponse.json();
      return participants as Array<{ id: number; username: string }>;
    } catch (error) {
      console.error(
        `Error fetching participants for session ${sessionId}:`,
        error
      );
      return [];
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/`);
      if (!response.ok) throw new Error("Failed to fetch sessions");
      const sessions = (await response.json()) as SessionData[];

      // Fetch participants for each session
      const sessionsWithParticipants = await Promise.all(
        sessions.map(async (session: SessionData) => {
          const participants = await fetchSessionParticipants(session.id);
          return {
            ...session,
            participants,
          };
        })
      );

      setAllSessions(sessionsWithParticipants);

      // Update selected session if it exists
      if (selectedSession) {
        const updatedSelectedSession = sessionsWithParticipants.find(
          (session) => session.id === selectedSession.id
        );
        if (updatedSelectedSession) {
          setSelectedSession(updatedSelectedSession);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = allSessions;

    // First filter by date
    if (showHistorical) {
      filtered = filtered
        .filter((session) => isHistoricalSession(session))
        .sort(
          (a, b) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        ); // Sort descending for past sessions
    } else {
      filtered = filtered
        .filter((session) => !isHistoricalSession(session))
        .sort(
          (a, b) =>
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        ); // Keep ascending for upcoming
    }

    if (selectedSport === "All Upcoming") {
      setFilteredSessions(filtered);
    } else if (selectedSport === "My Sessions") {
      console.log("User ID:", userData?.id);
      console.log("Filtered sessions:", filtered);
      const myFiltered = filtered.filter((session) =>
        session.participants?.includes(userData?.id)
      );
      console.log("My filtered sessions:", myFiltered);
      setFilteredSessions(myFiltered);
    } else {
      const sportFiltered = filtered.filter(
        (session) => session.sport.name === selectedSport
      );
      setFilteredSessions(sportFiltered);
    }
  }, [selectedSport, allSessions, userData?.id, showHistorical]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionClick = (session: SessionData) => {
    setSelectedSession(session);
    setIsCreating(false); // Close create form when selecting a session
  };

  const handleCloseSidebar = () => {
    setSelectedSession(null);
  };

  const handleSessionCreated = async (sessionData: any) => {
    setIsCreating(false);
    setSuccessMessage("Session created successfully!");
    await fetchSessions();
    setSelectedSession(sessionData);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleParticipantUpdate = async (
    sessionId: number,
    isJoining: boolean
  ) => {
    if (!userData) return;

    setAllSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            current_participants: isJoining
              ? session.current_participants + 1
              : session.current_participants - 1,
            participants: isJoining
              ? [...(session.participants || []), userData.id]
              : (session.participants || []).filter((id) => id !== userData.id),
          };
        }
        return session;
      })
    );
  };

  if (!user) {
    return <div className={styles.error}>Please sign in to view sessions</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Loading sessions...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }



  return (
    <div className={styles.feed}>
      <div className={styles.sessionsPanel}>
        <div className={styles.feedHeader}>
          <div className={styles.titleSection}>
            <h2 className={styles.feedTitle}>
              {selectedSport === "My Sessions" ? "My " : ""}
              {showHistorical ? "Past" : "Upcoming"} Sessions
            </h2>
          </div>
          <button
            className={styles.newSessionButton}
            onClick={() => setIsCreating(true)}
          >
            + New Session
          </button>
          <button
            className={styles.toggleButton}
            onClick={() => setShowHistorical(!showHistorical)}
          >
            Show {showHistorical ? "Upcoming" : "Past"} Sessions
          </button>
        </div>
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}
        <div className={styles.feedGrid}>
          {filteredSessions.length === 0 ? (
            <div className={styles.noSessions}>
              {selectedSport === "My Sessions" 
                ? `You have no ${showHistorical ? 'past' : 'upcoming'} sessions`
                : `No ${showHistorical ? 'past' : 'upcoming'} ${selectedSport === "All Upcoming" ? '' : selectedSport} sessions available`}
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`${styles.sessionCard} ${
                  selectedSession?.id === session.id ? styles.active : ""
                }`}
                onClick={() => handleSessionClick(session)}
              >
                <Session {...session} />
              </div>
            ))
          )}
        </div>
      </div>

      {isCreating ? (
        <SessionForm
          onClose={() => setIsCreating(false)}
          onSubmit={handleSessionCreated}
          userData={userData}
        />
      ) : (
        selectedSession && (
          <SessionSidebar
            selectedSession={selectedSession}
            onClose={handleCloseSidebar}
            currentUser={userData}
            onParticipantUpdate={(isJoining) =>
              handleParticipantUpdate(selectedSession.id, isJoining)
            }
          />
        )
      )}
    </div>
  );
};

export default Feed;
