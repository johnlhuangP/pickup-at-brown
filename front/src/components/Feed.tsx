import styles from './feed.module.css'; // Import the CSS module

interface FeedProps {
  selectedSport: string;
}

const Feed = ({ selectedSport }: FeedProps) => {
  return (
    <div className={styles.feed}> {/* Apply the feed class */}
      <h2>{selectedSport ? `Showing feed for: ${selectedSport}` : 'Select a sport to view the feed'}</h2>
      <div className={styles.feedContent}> {/* Apply feed-content class */}
        {/* Add more content here related to the selected sport */}
        <p>This is where the feed content will go.</p>
      </div>
    </div>
  );
};

export default Feed;
