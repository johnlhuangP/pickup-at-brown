import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import styles from './recommendedFriends.module.css';

interface SportDetail {
  sport_name: string;
  skill_level: string;
}

interface RecommendedUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  matching_sports: SportDetail[];
  shared_sessions_count: number;
}

const RecommendedFriends: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  // First fetch the user's database ID
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/users/supabase/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      }
    };

    fetchUserData();
  }, [user?.id]);

  // Then fetch recommendations using the database ID
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userData?.id) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/friendships/recommended/${userData.id}?limit=3`);
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    if (userData?.id) {
      fetchRecommendations();
    }
  }, [userData?.id]);

  const handleAddFriend = async (friendId: number) => {
    if (!userData?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/friendships/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.id,
          friend_id: friendId,
        }),
      });

      if (!response.ok) throw new Error('Failed to send friend request');
      
      // Remove the user from recommendations after sending request
      setRecommendations(prev => prev.filter(rec => rec.id !== friendId));
    } catch (err) {
      console.error('Error sending friend request:', err);
      setError('Failed to send friend request');
    }
  };

  if (loading && !error) return <div className={styles.loading}>Loading recommendations...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (recommendations.length === 0) return <div className={styles.empty}>No recommendations available</div>;

  return (
    <div className={styles.container}>
      {recommendations.map((rec) => (
        <div key={rec.id} className={styles.recommendationCard}>
          <div className={styles.userInfo}>
            <Link to={`/public-profile/${rec.id}`} className={styles.userName}>
              {rec.first_name} {rec.last_name}
            </Link>
            <span className={styles.username}>@{rec.username}</span>
          </div>
          
          <div className={styles.matchingInfo}>
            <div className={styles.sports}>
              <h4>Matching Sports:</h4>
              <div className={styles.sportsList}>
                {rec.matching_sports.map((sport, index) => (
                  <span key={index} className={styles.sport}>
                    {sport.sport_name} ({sport.skill_level})
                  </span>
                ))}
              </div>
            </div>
            
            {rec.shared_sessions_count > 0 && (
              <div className={styles.sessions}>
                <span>{rec.shared_sessions_count} shared sessions</span>
              </div>
            )}
          </div>

          <button
            onClick={() => handleAddFriend(rec.id)}
            className={styles.addButton}
          >
            Add Friend
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecommendedFriends;