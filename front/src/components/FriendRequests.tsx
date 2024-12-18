import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import styles from './friendRequests.module.css';

interface Sender {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

interface FriendRequest {
  friendship_id: number;
  sender: Sender;
  created_at: string;
}

interface FriendRequestsProps {
  userId: number;
  onRequestHandled?: () => void;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ userId, onRequestHandled }) => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/friendships/pending/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch friend requests');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching friend requests:', err);
      setError('Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const handleAccept = async (friendshipId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/friendships/${friendshipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          friend_id: friendshipId,
          status: 'accepted'
        }),
      });

      if (!response.ok) throw new Error('Failed to accept friend request');
      
      // Remove the request from the list
      setRequests(prev => prev.filter(req => req.friendship_id !== friendshipId));
      
      // Notify parent component if needed
      if (onRequestHandled) {
        onRequestHandled();
      }
    } catch (err) {
      console.error('Error accepting friend request:', err);
      setError('Failed to accept friend request');
    }
  };

  const handleReject = async (friendshipId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/friendships/${friendshipId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to reject friend request');
      
      // Remove the request from the list
      setRequests(prev => prev.filter(req => req.friendship_id !== friendshipId));
      
      // Notify parent component if needed
      if (onRequestHandled) {
        onRequestHandled();
      }
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      setError('Failed to reject friend request');
    }
  };

  if (loading) return <div className={styles.loading}>Loading friend requests...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (requests.length === 0) return <div className={styles.empty}>No pending friend requests</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Friend Requests</h3>
      <div className={styles.requestsList}>
        {requests.map((request) => (
          <div key={request.friendship_id} className={styles.requestCard}>
            <div className={styles.userInfo}>
              <Link to={`/public-profile/${request.sender.id}`} className={styles.userName}>
                {request.sender.first_name} {request.sender.last_name}
              </Link>
              <span className={styles.username}>@{request.sender.username}</span>
            </div>
            
            <div className={styles.actions}>
              <button
                onClick={() => handleAccept(request.friendship_id)}
                className={styles.acceptButton}
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request.friendship_id)}
                className={styles.rejectButton}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequests; 