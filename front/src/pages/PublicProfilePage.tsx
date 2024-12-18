import React, { useEffect, useState } from "react";
import "./profilepage.css";
import blankProfile from "../assets/empty_profile.png";
import UserSessions from "../components/UserSessions";
import Friends from "../components/Friends";
import { API_BASE_URL } from "../config";

interface SportPreference {
  sport_name: string;
  skill_level: string;
  notification_enabled: boolean;
}

interface PublicProfilePageProps {
  profileUserId: number;
}

/**
 * A read-only profile page for viewing another user's information.
 * - No edit functionality
 * - No "Recommended Friends" tab
 * - Fetches user data by their ID
 */
const PublicProfilePage: React.FC<PublicProfilePageProps> = ({
  profileUserId,
}) => {
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("tab-activity");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/users/${profileUserId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user profile data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user profile data:", err);
        setError("Failed to fetch user profile");
      }
    };

    fetchUserProfile();
  }, [profileUserId]);

  if (!userData) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="container  ">
      <div className="row" id="user-profile">
        <div className="col-lg-3 col-md-4 col-sm-4">
          <div className="main-box clearfix">
            <h2>
              {userData.first_name} {userData.last_name}
            </h2>
            <img src={blankProfile} className="img-radius" alt="User-Profile" />

            <div className="profile-label">
              <h5>@{userData.username}</h5>
            </div>

            <div className="profile-details">
              <h6 className="m-b-10">Email</h6>
              <p className="text-muted">{userData.email}</p>

              <h6 className="m-b-10">Bio</h6>
              <p className="text-muted">{userData.bio || "No bio added yet"}</p>

              <h6 className="m-b-10">Sports Preferences</h6>
              <div className="sports-list">
                {userData.sport_preferences &&
                  userData.sport_preferences.map(
                    (sport: SportPreference, index: number) => (
                      <div key={index} className="sport-item">
                        <span>{sport.sport_name}</span>
                        <span className="skill-level">
                          ({sport.skill_level})
                        </span>
                      </div>
                    )
                  )}
              </div>
            </div>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>

        <div className="col-lg-9 col-md-8 col-sm-8">
          <div className="main-box clearfix">
            <div className="tabs-wrapper profile-tabs">
              <ul className="nav nav-tabs">
                <li className={activeTab === "tab-activity" ? "active" : ""}>
                  <a
                    href="#tab-activity"
                    onClick={() => setActiveTab("tab-activity")}
                  >
                    Past Sessions
                  </a>
                </li>
                <li className={activeTab === "tab-friends" ? "active" : ""}>
                  <a
                    href="#tab-friends"
                    onClick={() => setActiveTab("tab-friends")}
                  >
                    Friends
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                {activeTab === "tab-activity" && (
                  <PastSessions creator_id={userData.id} />
                )}
                {activeTab === "tab-friends" && (
                  <Friends user_id={userData.id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
