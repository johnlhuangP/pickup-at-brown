import React from 'react';
import { useEffect, useState } from 'react';
import './profilepage.css';
import blankProfile from '../assets/empty_profile.png';
import { useUser } from '@clerk/clerk-react';
import PastSessions from '../components/PastSessions';
import Friends from '../components/Friends';
import RecommendedFriends from '../components/RecommendedFriends';

const UserProfileCard: React.FC = () => {
    const { isSignedIn, user, isLoaded } = useUser();
    const [realName, setRealName] = useState('');
    const [user_id, setUserId] = useState<number>(0);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState<string | undefined>('');
    const [bio, setBio] = useState('');
    const [skill_level, setSkillLevel] = useState('');
    const [sport_preferences, setSportPreferences] = useState<string[]>([]);
    const [newSport, setNewSport] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('tab-activity');


    useEffect(() => {
        let mounted = true;

        async function fetchUserProfile() {
            if (!isLoaded || !isSignedIn || !user) {
                return;
            }
            try {
                const CLERK_USER_ID = user.id;
                console.log(CLERK_USER_ID)
                const response = await fetch(`http://127.0.0.1:8000/users/${CLERK_USER_ID}/profile`)
                const data = await response.json();
                interface SportPreference {
                    sport_name: string;
                    skill_level: string;
                    notification_enabled: boolean;
                }
                const userInfo = {
                    id: data.id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    username: data.username,
                    bio: data.bio,
                    skill_level: data.skill_level,
                    sport_preferences: data.sport_preferences.map((sport: SportPreference) => sport.sport_name)
                }
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
                    setRealName(userInfo.first_name + ' ' + userInfo.last_name);
                    setUsername(userInfo.username);
                    setEmail(user?.primaryEmailAddress?.emailAddress);
                    setBio(userInfo.bio);
                    setSkillLevel(userInfo.skill_level);
                    setSportPreferences(userInfo.sport_preferences);

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
    }, [user, isLoaded, isSignedIn]);

    const handleUpdateProfile = async () => {
        console.log(sport_preferences);
        try {
            const updatedProfile = {
                "bio": bio,
                "skill_level":skill_level,
                "sport_preferences": sport_preferences.map((sport) => ({ "sport_name": sport, "skill_level": "beginner", "notification_enabled": true })),
            };
            const response = await fetch(`http://127.0.0.1:8000/users/${user_id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProfile),
            });
            const data = await response.json();
            console.log(data);

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
    };
    
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="container bootstrap snippets bootdeys">
            <div className="row" id="user-profile">
                <div className="col-lg-3 col-md-4 col-sm-4">
                    <div className="main-box clearfix">
                        <h2>John Doe</h2>
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
                        <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Skill Level</h6>
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={skill_level}
                                    onChange={(e) => setSkillLevel(e.target.value)}
                                />
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
                        <h6 className='m-b-20 m-t-40 p-b-5 b-b-default f-w-600'>Sports Preferences</h6>
                        <div>
                            {isEditing ? (
                                <div className="mb-3">
                                    <select
                                        className="form-select"
                                        name="sports"
                                        multiple
                                        required
                                        value={sport_preferences}
                                        onChange={(e) => {setSportPreferences(Array.from(e.target.selectedOptions, option => option.value))}}
                                    >
                                        <option value="basketball">Basketball</option>
                                        <option value="soccer">Soccer</option>
                                        <option value="tennis">Tennis</option>
                                        <option value="volleyball">Volleyball</option>
                                        <option value="Badminton">Badminton</option>
                                        <option value="Pickleball">Pickleball</option>
                                    </select>
                                    <small className="text-muted">
                                        Hold Ctrl (Windows) or Command (Mac) to select multiple options.
                                    </small>
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
                                <li className={activeTab === 'tab-activity' ? 'active' : ''}>
                                    <a href="#tab-activity" onClick={() => handleTabChange('tab-activity')} data-toggle="tab">Past Sessions</a>
                                </li>
                                <li className={activeTab === 'tab-friends' ? 'active' : ''}>
                                    <a href="#tab-friends" onClick={() => handleTabChange('tab-friends')} data-toggle="tab">Friends</a>
                                </li>
                                <li className={activeTab === 'tab-chat' ? 'active' : ''}>
                                    <a href="#tab-chat" onClick={() => handleTabChange('tab-chat')} data-toggle="tab">Recommended Friends</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                {activeTab === 'tab-activity' && <PastSessions creator_id={user_id}/>}
                                {activeTab === 'tab-friends' && <Friends user_id={user_id} />}
                                {activeTab === 'tab-chat' && <RecommendedFriends />}
                            </div>
                            <div className="tab-pane fade" id="tab-friends">
                                <ul className="widget-users row">
                                    <li className="col-md-6">
                                        <div className="img">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar1.png" className="img-responsive" alt="" />
                                        </div>
                                        <div className="details">
                                            <div className="name">
                                                <a href="#">John Doe</a>
                                            </div>
                                        </div>
                                    </li>
                                    {/* Repeat similar structure for other users */}
                                </ul>
                                <br />
                                <a href="#" className="btn btn-success pull-right">View all users</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );



    // return (
    //     <div className="page-content page-container" id="page-content">
    //         <div className="padding">
    //             <div className="row container d-flex justify-content-center">
    //                 <div className="col-xl-6 col-md-12">
    //                     <div className="card user-card-full">
    //                         <div className="row m-l-0 m-r-0">
    //                             <div className="col-sm-4 bg-c-lite-green user-profile">
    //                                 <div className="card-block text-center text-white">
    //                                     <div className="m-b-25">
    //                                         <img
    //                                             src={blankProfile}
    //                                             className="img-radius"
    //                                             alt="User-Profile-Image"
    //                                         />
    //                                     </div>
    //                                     <h3 className="f-w-600">
    //                                         {isEditing ? (
    //                                             <input
    //                                                 type="text"
    //                                                 className="form-control"
    //                                                 value={realName}
    //                                                 onChange={(e) => setRealName(e.target.value)}
    //                                             />
    //                                         ) : (
    //                                             realName
    //                                         )}
    //                                     </h3>
    //                                     <h5>
    //                                         {isEditing ? (
    //                                             <input
    //                                                 type="text"
    //                                                 className="form-control"
    //                                                 value={username}
    //                                                 onChange={(e) => setUsername(e.target.value)}
    //                                             />
    //                                         ) : (
    //                                             `@${username}`
    //                                         )}
    //                                     </h5>
    //                                     <br />
    //                                     <br />
    //                                     <b>Skill Level:</b>
    //                                     <p>
    //                                         {isEditing ? (
    //                                             <input
    //                                                 type="text"
    //                                                 className="form-control"
    //                                                 value={skill_level}
    //                                                 onChange={(e) => setSkillLevel(e.target.value)}
    //                                             />
    //                                         ) : (
    //                                             skill_level
    //                                         )}
    //                                     </p>
    //                                     <i className="mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
    //                                 </div>
    //                             </div>
    //                             <div className="col-sm-8">
    //                                 <div className="card-block">
    // <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
    // <div className="row">
    //     <div>
    //         <p className="m-b-10 f-w-600">Email</p>
    //         {isEditing ? (
    //             <input
    //                 type="email"
    //                 className="form-control"
    //                 value={email}
    //                 onChange={(e) => setEmail(e.target.value)}
    //             />
    //         ) : (
    //             <h6 className="text-muted f-w-400">{email}</h6>
    //         )}

    //     </div>
    // </div>
    // <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Bio</h6>
    // <div>
    //     {isEditing ? (
    //         <textarea
    //             className="form-control"
    //             value={bio}
    //             onChange={(e) => setBio(e.target.value)}
    //             rows={3}
    //         />
    //     ) : (
    //         <p className="m-b-10 f-w-600">{bio}</p>
    //     )}
    // </div>
    // <h6 className='m-b-20 m-t-40 p-b-5 b-b-default f-w-600'>Sports Preferences</h6>
    // <div>
    //     {isEditing ? (
    //         <div className="sports-grid">
    //             {sport_preferences.map((sport, index) => (
    //                 <div key={index} className="sport-item">
    //                     <div className="form-check">
    //                         <input
    //                             className="form-check-input"
    //                             type="checkbox"
    //                             value={sport}
    //                             id={`sport-${index}`}
    //                             checked={sport_preferences.includes(sport)}
    //                             onChange={(e) => {
    //                                 if (e.target.checked) {
    //                                     setSportPreferences([...sport_preferences, sport]);
    //                                 } else {
    //                                     setSportPreferences(sport_preferences.filter((item) => item !== sport));
    //                                 }
    //                             }}
    //                         />
    //                         <label className="form-check-label" htmlFor={`sport-${index}`}>
    //                             {sport}
    //                         </label>
    //                     </div>
    //                 </div>
    //             ))}
    //             <form onSubmit={handleAddSport} className="mb-3">
    //                 <div className="input-group">
    //                     <input
    //                         type="text"
    //                         className="form-control"
    //                         placeholder="Add new sport..."
    //                         value={newSport}
    //                         onChange={(e) => setNewSport(e.target.value)}
    //                     />
    //                     <button
    //                         type="submit"
    //                         className="btn btn-primary"
    //                         disabled={!newSport.trim()}
    //                     >
    //                         Add Sport
    //                     </button>
    //                 </div>
    //             </form>
    //         </div>
    //     ) : (
    //         <div className="sports-grid">
    //             {sport_preferences.map((sport, index) => (
    //                 <div key={index} className="sport-item">
    //                     <p className="m-b-10 f-w-600">{sport}</p>
    //                 </div>
    //             ))}
    //         </div>
    //     )}
    // </div>
    //                                     <div>
    //                                         {!isEditing ? (
    //                                             <button
    //                                                 className="btn btn-primary btn-sm"
    //                                                 onClick={() => setIsEditing(true)}
    //                                             >
    //                                                 Edit Profile
    //                                             </button>
    //                                         ) : (
    //                                             <div>
    //                                                 <button
    //                                                     className="btn btn-success btn-sm me-2"
    //                                                     onClick={handleUpdateProfile}
    //                                                 >
    //                                                     Save
    //                                                 </button>
    //                                                 <button
    //                                                     className="btn btn-secondary btn-sm"
    //                                                     onClick={handleCancel}
    //                                                 >
    //                                                     Cancel
    //                                                 </button>
    //                                             </div>
    //                                         )}
    //                                     </div>
    //                                     {/* <div className="row">
    //                                         <div className="col-sm-6">
    //                                             <p className="m-b-10 f-w-600">Recent</p>
    //                                             <h6 className="text-muted f-w-400">Sam Disuja</h6>
    //                                         </div>
    //                                         <div className="col-sm-6">
    //                                             <p className="m-b-10 f-w-600">Most Viewed</p>
    //                                             <h6 className="text-muted f-w-400">Dinoter husainm</h6>
    //                                         </div>
    //                                     </div> */}
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};

const UserProfile: React.FC = () => {

};

export default UserProfileCard;
