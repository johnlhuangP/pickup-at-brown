import React from 'react';
import { useEffect, useState } from 'react';
import './profilepage.css';
import blankProfile from '../assets/empty_profile.png';


const UserProfileCard: React.FC = () => {
    const [initialData, setInitialData] = useState<any>(null);
    const [realName, setRealName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = React.useState('');
    const [skill_level, setSkillLevel] = useState('');
    const [sport_preferences, setSportPreferences] = useState<string[]>([]);
    const [newSport, setNewSport] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function fetchUserProfile() {
            try {
                if (!initialData) {
                    // Mock data
                    const mockData = {
                        first_name: "John",
                        last_name: "Doe",
                        username: "johndoe",
                        email: "john.doe@example.com",
                        bio: "Sophomore at Brown. I've been playing tennis for 5 years.",
                        skill_level: "intermediate",
                        notification_enabled: true,
                        sport_preferences: ["tennis", "basketball", "soccer", "volleyball", "badminton"]
                    };

                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Only update if component is still mounted
                    if (mounted) {
                        setRealName(mockData.first_name + ' ' + mockData.last_name);
                        setUsername(mockData.username);
                        setEmail(mockData.email);
                        setBio(mockData.bio);
                        setSkillLevel(mockData.skill_level);
                        setSportPreferences(mockData.sport_preferences);
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile data: ', error);
            }
        }

        fetchUserProfile();

        // Cleanup function
        return () => {
            mounted = false;
        };
    }, [initialData]);

    const handleUpdateProfile = async () => {
        try {
            const updatedProfile = {
                username,
                email,
                bio,
                skill_level,

            };

            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Profile updated:', updatedProfile);

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
    };
    const handleAddSport = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSport.trim() && !sport_preferences.includes(newSport.toLowerCase())) {
            const updatedSports = [...sport_preferences, newSport.toLowerCase()];
            setSportPreferences(updatedSports);
            setNewSport('');
            // TODO: Update backend when API is ready
            //updateBackend(updatedSports);
        }
    };
    const handleRemoveSport = (sportToRemove: string) => {
        const updatedSports = sport_preferences.filter(sport => sport !== sportToRemove);
        setSportPreferences(updatedSports);
        // TODO: Update backend when API is ready
        //updateBackend(updatedSports);
    };
    const updateBackend = async (updatedSports: string[]) => {
        try {
            // TODO: Replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('Backend updated with:', updatedSports);
        } catch (error) {
            console.error('Error updating sports:', error);
        }
    };

    return (
        <div className="page-content page-container" id="page-content">
            <div className="padding">
                <div className="row container d-flex justify-content-center">
                    <div className="col-xl-6 col-md-12">
                        <div className="card user-card-full">
                            <div className="row m-l-0 m-r-0">
                                <div className="col-sm-4 bg-c-lite-green user-profile">
                                    <div className="card-block text-center text-white">
                                        <div className="m-b-25">
                                            <img
                                                src={blankProfile}
                                                className="img-radius"
                                                alt="User-Profile-Image"
                                            />
                                        </div>
                                        <h3 className="f-w-600">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={realName}
                                                    onChange={(e) => setRealName(e.target.value)}
                                                />
                                            ) : (
                                                realName
                                            )}
                                        </h3>
                                        <h5>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            ) : (
                                                `@${username}`
                                            )}
                                        </h5>
                                        <br />
                                        <br />
                                        <b>Skill Level:</b>
                                        <p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={skill_level}
                                                    onChange={(e) => setSkillLevel(e.target.value)}
                                                />
                                            ) : (
                                                skill_level
                                            )}
                                        </p>
                                        <i className="mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                                    </div>
                                </div>
                                <div className="col-sm-8">
                                    <div className="card-block">
                                        <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                                        <div className="row">
                                            <div>
                                                <p className="m-b-10 f-w-600">Email</p>
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                ) : (
                                                    <h6 className="text-muted f-w-400">{email}</h6>
                                                )}

                                            </div>
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
                                        <h6 className='m-b-20 m-t-40 p-b-5 b-b-default f-w-600'>Sports Preferences</h6>
                                        <div>
                                            {isEditing ? (
                                                <div className="sports-grid">
                                                    {sport_preferences.map((sport, index) => (
                                                        <div key={index} className="sport-item">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value={sport}
                                                                    id={`sport-${index}`}
                                                                    checked={sport_preferences.includes(sport)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSportPreferences([...sport_preferences, sport]);
                                                                        } else {
                                                                            setSportPreferences(sport_preferences.filter((item) => item !== sport));
                                                                        }
                                                                    }}
                                                                />
                                                                <label className="form-check-label" htmlFor={`sport-${index}`}>
                                                                    {sport}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <form onSubmit={handleAddSport} className="mb-3">
                                                        <div className="input-group">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Add new sport..."
                                                                value={newSport}
                                                                onChange={(e) => setNewSport(e.target.value)}
                                                            />
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary"
                                                                disabled={!newSport.trim()}
                                                            >
                                                                Add Sport
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            ) : (
                                                <div className="sports-grid">
                                                    {sport_preferences.map((sport, index) => (
                                                        <div key={index} className="sport-item">
                                                            <p className="m-b-10 f-w-600">{sport}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            {!isEditing ? (
                                                <button
                                                    className="btn btn-primary btn-sm"
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
                                        {/* <div className="row">
                                            <div className="col-sm-6">
                                                <p className="m-b-10 f-w-600">Recent</p>
                                                <h6 className="text-muted f-w-400">Sam Disuja</h6>
                                            </div>
                                            <div className="col-sm-6">
                                                <p className="m-b-10 f-w-600">Most Viewed</p>
                                                <h6 className="text-muted f-w-400">Dinoter husainm</h6>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;
