// import { useState } from 'react';
// import styles from './MySessions.module.css'; // Ensure this file exists
// import UpcomingSessions from './UpcomingSessions'; // Ensure these components exist
// import PastSessions from '../components/PastSessions';

// type TabType = 'upcoming' | 'past';

// const MySessions = () => {
//   const [activeTab, setActiveTab] = useState<TabType>('upcoming');

//   return (
//     <div className={styles.container}>
//       <div className={styles.tabs}>
//         <button
//           className={`${styles.tab} ${activeTab === 'upcoming' ? styles.active : ''}`}
//           onClick={() => setActiveTab('upcoming')}
//         >
//           Upcoming Sessions
//         </button>
//         <button
//           className={`${styles.tab} ${activeTab === 'past' ? styles.active : ''}`}
//           onClick={() => setActiveTab('past')}
//         >
//           Past Sessions
//         </button>
//       </div>

//       {activeTab === 'upcoming' ? (
//         <UpcomingSessions />
//       ) : (
//         <PastSessions />
//       )}
//     </div>
//   );
// };

// export default MySessions;
