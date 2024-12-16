import { useState, useEffect } from 'react';
import { CSidebar, CSidebarHeader, CSidebarBrand, CNavTitle, CNavItem, CBadge, CSidebarNav } from "@coreui/react";
import styles from './sidebar.module.css';
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
    <CSidebar className={`border-end ${styles.sidebar}`} colorScheme="dark">
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>Search</CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
        <CNavTitle>Sports</CNavTitle>
        <CNavItem
          href="/"
          onClick={(event) => handleSportSelect('All Upcoming', event)}
          className={selectedSport === 'All Upcoming' ? styles.selectedSport : ''}
        >
          All Upcoming
        </CNavItem>
        {sports.map(sport => (
          <CNavItem
            key={sport.id}
            href="/"
            onClick={(event) => handleSportSelect(sport.name, event)}
            className={selectedSport === sport.name ? styles.selectedSport : ''}
          >
            {sport.name}
          </CNavItem>
        ))}
      </CSidebarNav>
    </CSidebar>
  );
};

export default Sidebar;
