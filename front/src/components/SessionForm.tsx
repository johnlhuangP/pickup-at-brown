import React, { useState, useEffect } from 'react';
import styles from './sessionForm.module.css';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

interface SessionFormProps {
  onClose: () => void;
  onSubmit: (sessionData: any) => void;
  userData: {
    id: number;
    username: string;
    email: string;
    supabase_id: string;
  } | null;
}

interface Sport {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

const SessionForm: React.FC<SessionFormProps> = ({ onClose, onSubmit, userData }) => {
  const { user } = useAuth();
  const [sports, setSports] = useState<Sport[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current date and time, rounded to nearest 30 minutes
  const getDefaultDateTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 30) * 30;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sport_id: 0,
    location_id: 0,
    datetime: getDefaultDateTime(),  // Set default to current time
    max_participants: 10
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sportsResponse = await fetch(`${API_BASE_URL}/sports/`);
        if (!sportsResponse.ok) throw new Error('Failed to fetch sports');
        const sportsData = await sportsResponse.json();
        setSports(sportsData);

        const locationsResponse = await fetch(`${API_BASE_URL}/locations/`);
        if (!locationsResponse.ok) throw new Error('Failed to fetch locations');
        const locationsData = await locationsResponse.json();
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Failed to load form data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userData) {
      setError('You must be logged in to create a session');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/?creator_id=${userData.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            location_id: Number(formData.location_id),
            datetime: formData.datetime,
            max_participants: Number(formData.max_participants),
            sport_id: Number(formData.sport_id)
          })
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create session');
      }
      
      const data = await response.json();
      onSubmit(data);
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to create session. Please try again.');
    }
  };

  if (!user || !userData) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.error}>
          Please sign in to create a session
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>Create New Session</h2>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Sport</label>
          <select
            value={formData.sport_id}
            onChange={e => setFormData(prev => ({ ...prev, sport_id: Number(e.target.value) }))}
            required
            disabled={isLoading}
          >
            <option value="">Select a sport</option>
            {sports.map(sport => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <select
            value={formData.location_id}
            onChange={e => setFormData(prev => ({ ...prev, location_id: Number(e.target.value) }))}
            required
            disabled={isLoading}
          >
            <option value="">Select a location</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Date & Time</label>
          <input
            type="datetime-local"
            value={formData.datetime}
            onChange={e => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
            min={getDefaultDateTime()} // Prevent selecting past dates
            required
            className={styles.datetimeInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Max Participants</label>
          <input
            type="number"
            min="2"
            max="50"
            value={formData.max_participants}
            onChange={e => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) }))}
            required
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            Create Session
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionForm; 