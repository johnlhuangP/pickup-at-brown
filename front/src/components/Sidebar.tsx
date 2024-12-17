import { useState, useEffect } from 'react';
import styles from './sidebar.module.css'; // Import the custom CSS
import { API_BASE_URL } from '../config';

interface Sport {
  id: number;
  name: string;
}

interface SidebarProps {
  onSportSelect: (sport: string) => void;
  selectedSport: string;
}

const Sidebar = ({ onSportSelect, selectedSport }: SidebarProps) => {
  const [sports, setSports] = useState<Sport[]>([]);

  // Fetch sports data
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sports/`);
        if (!response.ok) throw new Error('Failed to fetch sports');
        const data = await response.json();
        setSports(data);
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    };

    fetchSports();
  }, []);

  const handleSportSelect = (sport: string, event: React.MouseEvent) => {
    event.preventDefault();
    onSportSelect(sport);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarBrand}>Sessions</div>
      </div>
      <div className={styles.sidebarNav}>
        <ul>
          <li>
            <a
              href="/"
              onClick={(event) => handleSportSelect('All Upcoming', event)}
              className={selectedSport === 'All Upcoming' ? styles.selectedSport : ''}
            >
              All Upcoming
            </a>
          </li>
          {sports.map(sport => (
            <li key={sport.id}>
              <a
                href="/"
                onClick={(event) => handleSportSelect(sport.name, event)}
                className={selectedSport === sport.name ? styles.selectedSport : ''}
              >
                {sport.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
