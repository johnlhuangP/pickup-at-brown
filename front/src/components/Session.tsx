import styles from './session.module.css'; // Import the CSS module for styling

// Define the shape of the session data being passed to the component
interface SessionProps {
  session: {
    id: number;
    title: string;
    description: string;
    datetime: string;
    location: {
      id: number;
      name: string;
    };
    creator: {
      id: number;
      username: string; // Assuming the creator has a 'username' property
    } | null;  // 'creator' can be null if no creator is associated
    max_participants: number;
    current_participants: number;
  };
}

const Session = ({ session }: SessionProps) => {
  const { title, description, datetime, location, creator, max_participants, current_participants } = session;

  // Format the session's datetime (optional: use a library like `moment.js` or `date-fns` for better formatting)
  const formattedDate = new Date(datetime).toLocaleString();

  return (
    <div className={styles.sessionItem}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Location:</strong> {location.name}</p>

      {/* Check if the creator exists and display it */}
      {creator ? (
        <p><strong>Creator:</strong> {creator.username}</p> // Display creator's username
      ) : (
        <p><strong>Creator:</strong> Unknown</p> // Handle cases where there is no creator
      )}

      <p>
        <strong>Participants:</strong> {current_participants} / {max_participants}
      </p>
    </div>
  );
};

export default Session;
