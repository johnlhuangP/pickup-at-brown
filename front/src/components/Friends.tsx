import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import  pfp_img  from '../assets/solid_color.png'

interface friendData {
    user_id: number;
    friend_id: number;
    friend: { id: number, username: string, email: string, first_name: string, last_name: string, skill_level:string  };
}
interface FriendsProps {
    user_id: number;
}

const Friends = ({ user_id }: FriendsProps) => {
    const [friends, setFriends] = useState<friendData[]>([]);

    const url = `http://127.0.0.1:8000/friendships/?user_id=${user_id}&skip=0&limit=100`

    useEffect(() => {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch friends');
                }
                return response.json();
            })
            .then((data) => {
                setFriends(data);
            })
            .catch((err) => {
                console.log(err)
            });
    }, [user_id]);

    return (
        <>
            {friends.length == 0 ? <div> <h3>No friends at the moment.</h3></div> : 
            friends.map((friend_entry) => (
                <div className="row mt-4">
                    <div className="col-sm-6 col-lg-4">
                        <div className="card hover-img">
                            <div className="card-body p-4 text-center border-bottom">
                                <img
                                    src={pfp_img}
                                    alt="blank profile picture"
                                    className="rounded-circle mb-3"
                                    width={80}
                                    height={80}
                                />
                                <h5 className="fw-semibold mb-0">{friend_entry.friend.first_name + ' ' + friend_entry.friend.last_name}</h5>
                                <p>{friend_entry.friend.username}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }
        </>
    );
};
export default Friends