import { useState } from 'react';

type TabType = 'upcoming' | 'past';

const MySessions = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.active : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Sessions
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'past' ? styles.active : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Sessions
        </button>
      </div>

      {activeTab === 'upcoming' ? (
        <UpcomingSessions />
      ) : (
        <PastSessions />
      )}
    </div>
  );
};

export default MySessions; 