import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pfp_img from "../assets/solid_color.png";

interface friendData {
  user_id: number;
  friend_id: number;
  friendship_id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  friend: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  status: string;
}

interface FriendsProps {
  user_id: number;
}

const Friends = ({ user_id }: FriendsProps) => {
  const [friends, setFriends] = useState<friendData[]>([]);
  const navigate = useNavigate();
  const url = `http://127.0.0.1:8000/friendships/?user_id=${user_id}&status=accepted&skip=0&limit=100`;

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }
        return response.json();
      })
      .then((data) => {
        setFriends(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user_id]);

  const handleFriendClick = (friendUserId: number) => {
    navigate(`/public-profile/${friendUserId}`);
  };

  const handleRemoveFriend = async (friendUserId: number) => {
    try {
      const deleteUrl = `http://127.0.0.1:8000/friendships/${friendUserId}?user_id=${user_id}`;
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove friend");
      }

      // Optionally, handle success message from server
      // const result = await response.json();
      // console.log(result.message);

      // Remove this friend from local state
      setFriends((prevFriends) =>
        prevFriends.filter((f) => f.friend.id !== friendUserId)
      );
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  if (friends.length === 0) {
    return (
      <div>
        <h3>No friends at the moment.</h3>
      </div>
    );
  }

  return (
    <>
      {friends.map((friend_entry) => {
        const friendUserId = friend_entry.friend.id;

        return (
          <div className="row mt-4" key={friend_entry.friendship_id}>
            <div className="col-sm-6 col-lg-4">
              <div
                className="card hover-img"
                style={{ cursor: "pointer" }}
                onClick={() => handleFriendClick(friendUserId)}
              >
                <div className="card-body p-4 text-center border-bottom">
                  <img
                    src={pfp_img}
                    alt="blank profile picture"
                    className="rounded-circle mb-3"
                    width={80}
                    height={80}
                  />
                  <h5 className="fw-semibold mb-0">
                    {friend_entry.friend.first_name}{" "}
                    {friend_entry.friend.last_name}
                  </h5>
                  <p>{friend_entry.friend.username}</p>
                </div>

                <div className="card-footer text-center">
                  <button
                    className="btn btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFriend(friendUserId);
                    }}
                  >
                    Remove Friend
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Friends;
