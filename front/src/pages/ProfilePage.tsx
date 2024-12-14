import React from 'react';
import { useEffect, useState } from 'react';
import './profilepage.css';
import blankProfile from '../assets/empty_profile.png';
import { useUser } from '@clerk/clerk-react';
import PastSessions from '../components/PastSessions';
import Friends from '../components/Friends';
import RecommendedFriends from '../components/RecommendedFriends';

interface SportPreference {
    sport_name: string;
    skill_level: string;
    notification_enabled: boolean;
}

const UserProfileCard: React.FC = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [realName, setRealName] = useState("");
  const [user_id, setUserId] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState<string | undefined>("");
  const [bio, setBio] = useState("");
  const [skill_level, setSkillLevel] = useState("");

  const [sportPreferences, setSportPreferences] = useState<SportPreference[]>(
    []
  );

  const availableSports = [
    { value: "Basketball", label: "Basketball" },
    { value: "Soccer", label: "Soccer" },
    { value: "Tennis", label: "Tennis" },
    { value: "Volleyball", label: "Volleyball" },
    { value: "Badminton", label: "Badminton" },
    { value: "Pickleball", label: "Pickleball" },
  ];

  const [newSport, setNewSport] = useState<string>("");

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("tab-activity");

  useEffect(() => {
    let mounted = true;

    async function fetchUserProfile() {
      if (!isLoaded || !isSignedIn || !user) {
        return;
      }
      try {
        const CLERK_USER_ID = user.id;
        console.log(CLERK_USER_ID);
        const response = await fetch(
          `http://127.0.0.1:8000/users/${CLERK_USER_ID}/profile`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile data");
        }

        const data = await response.json();

        const userInfo = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          bio: data.bio,
          skill_level: data.skill_level,
          sport_preferences: data.sport_preferences as SportPreference[],
        };
        // // Mock data
        // const mockData = {
        //     first_name: "John",
        //     last_name: "Doe",
        //     username: "johndoe",
        //     email: "john.doe@example.com",
        //     bio: "Sophomore at Brown. I've been playing tennis for 5 years.",
        //     skill_level: "intermediate",
        //     notification_enabled: true,
        //     sport_preferences: ["tennis", "basketball", "soccer", "volleyball", "badminton"]
        // };

        // // Simulate API delay
        // await new Promise(resolve => setTimeout(resolve, 1000));

        // Only update if component is still mounted
        if (mounted) {
          setUserId(userInfo.id);
          setRealName(userInfo.first_name + " " + userInfo.last_name);
          setUsername(userInfo.username);
          setEmail(user?.primaryEmailAddress?.emailAddress);
          setBio(userInfo.bio || "");
          setSkillLevel(userInfo.skill_level || "");
          setSportPreferences(userInfo.sport_preferences || []);
        }
      } catch (error) {
        console.error("Error fetching user profile data: ", error);
      }
    }

    fetchUserProfile();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [user, isLoaded, isSignedIn]);

  const handleUpdateProfile = async () => {
    try {
      const updatedProfile = {
        bio: bio,
        skill_level: skill_level,
        sport_preferences: sportPreferences.map((sport) => ({
          sport_name: sport.sport_name,
          skill_level: sport.skill_level,
          notification_enabled: sport.notification_enabled,
        })),
      };

      const response = await fetch(`http://127.0.0.1:8000/users/${user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });
      if (!response.ok) {
        throw new Error(`Update failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSportSkillChange = (index: number, newSkill: string) => {
    setSportPreferences((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        skill_level: newSkill,
      };
      return updated;
    });
  };


  const handleRemoveSport = (index: number) => {
    setSportPreferences((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleAddSport = () => {
    if (!newSport) return;

    const alreadyExists = sportPreferences.some(
      (sp) => sp.sport_name === newSport
    );
    if (alreadyExists) {
      alert("Sport already exists in your preferences.");
      return;
    }

    const newPreference: SportPreference = {
      sport_name: newSport,
      skill_level: "beginner",
      notification_enabled: true,
    };
    setSportPreferences((prev) => [...prev, newPreference]);
    setNewSport(""); // reset dropdown
  };

  return (
    <div className="container bootstrap snippets bootdeys">
      <div className="row" id="user-profile">
        <div className="col-lg-3 col-md-4 col-sm-4">
          <div className="main-box clearfix">
            <h2>{realName || "John Doe"}</h2>
            <img
              src={blankProfile}
              className="img-radius"
              alt="User-Profile-Image"
            />
            <div className="profile-label">
              <h5>{`@${username}`}</h5>
            </div>
            <hr className="profile-divider" />
            <div className="row">
              <div>
                <h6 className="m-b-10 f-w-600">Email</h6>
                <h6 className="text-muted f-w-400">{email}</h6>
              </div>
            </div>
            <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">
              Skill Level
            </h6>
            <div>
              {isEditing ? (
                <select
                  className="form-select"
                  value={skill_level}
                  onChange={(e) => setSkillLevel(e.target.value)}
                >
                  <option value="">Select a skill level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              ) : (
                <p className="text-muted f-w-400">{skill_level}</p>
              )}
            </div>
            <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Bio</h6>
            <div>
              {isEditing ? (
                <textarea
                  className="form-control"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="m-b-10 f-w-600">{bio}</p>
              )}
            </div>
            <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">
              Sports Preferences
            </h6>

            {isEditing ? (
              <div className="sports-preferences-edit">
                {sportPreferences.map((sport, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <b className="me-2">{sport.sport_name}</b>
                    <select
                      className="form-select form-select-sm"
                      value={sport.skill_level}
                      onChange={(e) =>
                        handleSportSkillChange(index, e.target.value)
                      }
                      style={{ maxWidth: "120px", marginRight: "8px" }}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveSport(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="d-flex align-items-center mt-3">
                  <select
                    className="form-select form-select-sm me-2"
                    value={newSport}
                    onChange={(e) => setNewSport(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  >
                    <option value="">Add new sport...</option>
                    {availableSports.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleAddSport}
                  >
                    Add Sport
                  </button>
                </div>
              </div>
            ) : (
              <div className="sports-grid">
                {sportPreferences.map((sport, index) => (
                  <div key={index} className="sport-item">
                    <p className="m-b-10 f-w-600">
                      {sport.sport_name} ({sport.skill_level})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {!isEditing ? (
              <button
                className="btn btn-primary edit-profile"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={handleUpdateProfile}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-8 col-md-8 col-sm-8">
          <div className="main-box clearfix">
            <div className="tabs-wrapper profile-tabs">
              <ul className="nav nav-tabs">
                <li className={activeTab === "tab-activity" ? "active" : ""}>
                  <a
                    href="#tab-activity"
                    onClick={() => handleTabChange("tab-activity")}
                    data-toggle="tab"
                  >
                    Past Sessions
                  </a>
                </li>
                <li className={activeTab === "tab-friends" ? "active" : ""}>
                  <a
                    href="#tab-friends"
                    onClick={() => handleTabChange("tab-friends")}
                    data-toggle="tab"
                  >
                    Friends
                  </a>
                </li>
                <li className={activeTab === "tab-chat" ? "active" : ""}>
                  <a
                    href="#tab-chat"
                    onClick={() => handleTabChange("tab-chat")}
                    data-toggle="tab"
                  >
                    Recommended Friends
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                {activeTab === "tab-activity" && (
                  <PastSessions creator_id={user_id} />
                )}
                {activeTab === "tab-friends" && <Friends user_id={user_id} />}
                {activeTab === "tab-chat" && <RecommendedFriends />}
              </div>

              <div className="tab-pane fade" id="tab-friends">
                <ul className="widget-users row">
                  <li className="col-md-6">
                    <div className="img">
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar1.png"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <div className="details">
                      <div className="name">
                        <a href="#">John Doe</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <br />
                <a href="#" className="btn btn-success pull-right">
                  View all users
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;