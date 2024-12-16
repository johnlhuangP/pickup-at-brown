import { useState } from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import Feed from "../components/Feed"; // Import Feed component

const HomePage = () => {
  const [selectedSport, setSelectedSport] = useState<string>(""); // State for selected sport

  // Handler to update the selected sport
  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport); // Set the selected sport state
  };

  return (
    <div className="home-page" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar component receives the selected sport and handler */}
      <Sidebar
        onSportSelect={handleSportSelect}
        selectedSport={selectedSport}
      />

      {/* Content section */}
      <div
        className="content"
        style={{
          flexGrow: 1,
          marginLeft: "230px", // Adjust based on sidebar width
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "left",
          textAlign: "center",
        }}
      >
        {/* Feed component receives the selected sport */}
        <Feed selectedSport={selectedSport} />
      </div>
    </div>
  );
};

export default HomePage;
