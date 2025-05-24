// components/UserList.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AllUsers.module.css';

// types/User.ts
export interface User {
    id: number;
    username: string;
    profile_picture: string | null;
}

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/users')
            .then((res) => res.json())
            .then((data: User[]) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Kunde inte hämta användare:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Laddar användare...</p>;

    return (
        <div className={styles.container}>
            {users.map((user) => (
                <div
                    key={user.id}
                    className={styles.userCard}
                    onClick={() => navigate(`/user/${user.id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src={
                            user.profile_picture
                                ? `http://localhost:5000${user.profile_picture}`
                                : '/default-profile.png'
                        }
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/default_profile.png';
                        }}
                        alt={user.username}
                        className={styles.profilePicture}
                    />
                    <h3 className={styles.username}>{user.username}</h3>
                </div>
            ))}
        </div>
    );
};

export default UserList;
