import { useState } from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import Feed from "../components/Feed"; // Import Feed component
import styles from './homepage.module.css'; // Import the new CSS module

const HomePage = () => {
  const [selectedSport, setSelectedSport] = useState<string>(""); // State for selected sport

  // Handler to update the selected sport
  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport); // Set the selected sport state
  };

  return (
    <div className={styles.homePage}>
      {/* Sidebar component receives the selected sport and handler */}
      <Sidebar
        onSportSelect={handleSportSelect}
        selectedSport={selectedSport}
      />

      {/* Content section */}
      <div className={styles.content}>
        {/* Feed component receives the selected sport */}
        <Feed selectedSport={selectedSport} />
      </div>
    </div>
  );
};

export default HomePage;
