import { CSidebar, CSidebarHeader, CSidebarBrand, CNavTitle, CNavItem, CBadge, CSidebarNav, CSidebarToggler } from "@coreui/react";
import styles from './sidebar.module.css';

interface SidebarProps {
  onSportSelect: (sport: string) => void;  // Function passed from HomePage
  selectedSport: string; // The selected sport passed from HomePage
}

const Sidebar = ({ onSportSelect, selectedSport }: SidebarProps) => {
  const handleSportSelect = (sport: string, event: React.MouseEvent) => {
    // Prevent default navigation behavior
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
        {/* Apply light blue color to the selected sport */}
        <CNavItem
          href="/"
          onClick={(event) => handleSportSelect('All Upcoming', event)}
          className={selectedSport === 'All Upcoming' ? styles.selectedSport : ''}
        >
          All Upcoming
        </CNavItem>
        <CNavItem
          href="/"
          onClick={(event) => handleSportSelect('Basketball', event)}
          className={selectedSport === 'Basketball' ? styles.selectedSport : ''}
        >
          Basketball
        </CNavItem>
        <CNavItem
          href="/"
          onClick={(event) => handleSportSelect('Soccer', event)}
          className={selectedSport === 'Soccer' ? styles.selectedSport : ''}
        >
          Soccer <CBadge color="primary ms-auto">NEW</CBadge>
        </CNavItem>
        <CNavItem
          href="/"
          onClick={(event) => handleSportSelect('Other Sport', event)}
          className={selectedSport === 'Other Sport' ? styles.selectedSport : ''}
        >
          Other Sport
        </CNavItem>
      </CSidebarNav>
      <CSidebarHeader className="border-top">
        <CSidebarToggler />
      </CSidebarHeader>
    </CSidebar>
  );
};

export default Sidebar;
