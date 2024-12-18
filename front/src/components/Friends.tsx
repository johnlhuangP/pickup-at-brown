import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import styles from './friends.module.css';

interface FriendData {
  user_id: number;
  friend_id: number;
  friendship_id: number;
  friend: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  status: string;
}

interface FriendsProps {
  user_id: number;
}

const Friends: React.FC<FriendsProps> = ({ user_id }) => {
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/friendships/?user_id=${user_id}&status=accepted&skip=0&limit=100`
        );
        if (!response.ok) throw new Error('Failed to fetch friends');
        const data = await response.json();
        setFriends(data);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError('Failed to load friends');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user_id]);

  const handleRemoveFriend = async (friendUserId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/friendships/${friendUserId}?user_id=${user_id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to remove friend');
      
      // Remove this friend from local state
      setFriends(prevFriends => 
        prevFriends.filter(f => f.friend.id !== friendUserId)
      );
    } catch (err) {
      console.error('Error removing friend:', err);
      setError('Failed to remove friend');
    }
  };

  if (loading) return <div className={styles.loading}>Loading friends...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (friends.length === 0) return <div className={styles.empty}>No friends yet</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Friends</h3>
      <div className={styles.friendsList}>
        {friends.map((friend) => (
          <div key={friend.friendship_id} className={styles.friendCard}>
            <div className={styles.userInfo}>
              <Link to={`/public-profile/${friend.friend.id}`} className={styles.userName}>
                {friend.friend.first_name} {friend.friend.last_name}
              </Link>
              <span className={styles.username}>@{friend.friend.username}</span>
            </div>
            
            <div className={styles.actions}>
              <button
                onClick={() => handleRemoveFriend(friend.friend.id)}
                className={styles.removeButton}
              >
                Remove Friend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
