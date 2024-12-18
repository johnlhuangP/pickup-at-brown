import React from "react";
import { useEffect, useState } from "react";
import "./profilepage.css";
import blankProfile from "../assets/empty_profile.png";
import { useAuth } from "../contexts/AuthContext";
import UserSessions from "../components/UserSessions";
import Friends from "../components/Friends";
import RecommendedFriends from "../components/RecommendedFriends";
import { API_BASE_URL } from "../config";
// import { useNavigate } from "react-router-dom";
import FriendRequests from '../components/FriendRequests';

interface SportPreference {
  sport_name: string;
  skill_level: string;
  notification_enabled: boolean;
}

const UserProfileCard: React.FC = () => {
  // const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("tab-activity");
  const [error, setError] = useState<string | null>(null);

  const availableSports = [
    { value: "Basketball", label: "Basketball" },
    { value: "Soccer", label: "Soccer" },
    { value: "Tennis", label: "Tennis" },
    { value: "Volleyball", label: "Volleyball" },
    { value: "Badminton", label: "Badminton" },
    { value: "Pickleball", label: "Pickleball" },
  ];

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    bio: "",
    sport_preferences: [] as SportPreference[],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/users/supabase/${user.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch user profile data");
        const data = await response.json();
        setUserData(data);
        setFormData({
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          bio: data.bio || "",
          sport_preferences: data.sport_preferences || [],
        });
      } catch (err) {
        console.error("Error fetching user profile data:", err);
        setError("Failed to fetch user profile");
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSportSkillChange = (index: number, newSkill: string) => {
    setFormData((prev) => {
      const updatedPreferences = [...prev.sport_preferences];
      updatedPreferences[index] = {
        ...updatedPreferences[index],
        skill_level: newSkill,
      };
      return {
        ...prev,
        sport_preferences: updatedPreferences,
      };
    });
  };

  const handleRemoveSport = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sport_preferences: prev.sport_preferences.filter((_, i) => i !== index),
    }));
  };

  const handleAddSport = (sportName: string) => {
    if (!sportName) return;

    const alreadyExists = formData.sport_preferences.some(
      (sp) => sp.sport_name === sportName
    );

    if (alreadyExists) {
      setError("Sport already exists in your preferences");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sport_preferences: [
        ...prev.sport_preferences,
        {
          sport_name: sportName,
          skill_level: "beginner",
          notification_enabled: true,
        },
      ],
    }));
  };

  if (!user || !userData) {
    // navigate("/register");
    return <div className="loading">Redirecting you to profile creation!</div>;
  }

  return (
    <div className="container">
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
              <p className="text-muted">{user.email}</p>

              <h6 className="m-b-10">Bio</h6>
              {isEditing ? (
                <textarea
                  className="form-control"
                  name="bio"
                  value={formData.bio}
                  onChange={handleFormChange}
                  rows={3}
                />
              ) : (
                <p className="text-muted">
                  {userData.bio || "No bio added yet"}
                </p>
              )}

              <h6 className="m-b-10">Sports Preferences</h6>
              {isEditing ? (
                <div className="sports-preferences-edit">
                  {formData.sport_preferences.map(
                    (sport: SportPreference, index: number) => (
                      <div key={index} className="sport-preference-item">
                        <span>{sport.sport_name}</span>
                        <select
                          value={sport.skill_level}
                          onChange={(e) =>
                            handleSportSkillChange(index, e.target.value)
                          }
                          className="form-select form-select-sm"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                        <button
                          onClick={() => handleRemoveSport(index)}
                          className="btn btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}

                  <select
                    className="form-select mt-3"
                    onChange={(e) => handleAddSport(e.target.value)}
                    value=""
                  >
                    <option value="">Add new sport...</option>
                    {availableSports.map((sport) => (
                      <option key={sport.value} value={sport.value}>
                        {sport.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="sports-list">
                  {userData.sport_preferences.map(
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
              )}
            </div>

            {error && <div className="alert alert-danger mt-3">{error}</div>}

            <div className="profile-actions mt-3">
              {isEditing ? (
                <>
                  <button
                    className="btn btn-success me-2"
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
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
                    Sessions
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
                <li className={activeTab === "tab-requests" ? "active" : ""}>
                  <a
                    href="#tab-requests"
                    onClick={() => setActiveTab("tab-requests")}
                  >
                    Friend Requests
                  </a>
                </li>
                <li className={activeTab === "tab-recommended" ? "active" : ""}>
                  <a
                    href="#tab-recommended"
                    onClick={() => setActiveTab("tab-recommended")}
                  >
                    Recommended Friends
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                {activeTab === "tab-activity" && (
                  <UserSessions creator_id={userData.id} />
                )}
                {activeTab === "tab-friends" && (
                  <Friends user_id={userData.id} />
                )}
                {activeTab === "tab-requests" && (
                  <FriendRequests 
                    userId={userData.id}
                    onRequestHandled={() => {
                      // Optionally refresh friends list or other data
                    }}
                  />
                )}
                {activeTab === "tab-recommended" && <RecommendedFriends />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
