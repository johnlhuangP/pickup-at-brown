import { useState } from 'react';
import Sidebar from "../components/Sidebar";  // Import the Sidebar component
import Feed from "../components/Feed";       // Import the Feed component

// HomePage component - serves as the main layout of the page
const HomePage = () => {
  // State to track the selected sport
  const [selectedSport, setSelectedSport] = useState<string>(''); 

  // Handler function to update the selected sport
  // This function will be passed to the Sidebar to update the state when a sport is selected
  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport); // Set the selected sport
  };

  return (
    <div className="home-page" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar component: This takes two props - the handler function to update the selected sport,
          and the current selected sport to highlight the selected item */}
      <Sidebar onSportSelect={handleSportSelect} selectedSport={selectedSport} />
      
      {/* Content section: This is where the Feed component will be displayed next to the Sidebar */}
      <div 
        className="content" 
        style={{ 
          flexGrow: 1,        // The content section will take up remaining space
          marginLeft: '230px',  // This ensures the content doesn't overlap with the sidebar (taking the sidebar width into account)
          padding: '10px',    // Add some padding around the content
          display: 'flex',     // Set display to flex to arrange items horizontally
          flexDirection: 'column',  // Items (like the selected sport and Feed) will be stacked vertically
          justifyContent: 'flex-start',  // Align items to the top
          alignItems: 'left',  // Center content horizontally
          textAlign: 'center'   // Center text inside the content section
        }}
      >
        {/* Feed component: Displays the feed based on the selected sport */}
        {/* We pass the selectedSport state as a prop to the Feed component */}
        <Feed selectedSport={selectedSport} />
      </div>
    </div>
  );
};

export default HomePage;
