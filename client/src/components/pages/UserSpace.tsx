import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PersonalSpace.module.css'; // Återanvänd stilar
import axios from 'axios';

interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    profile_picture?: string;
    bio: string;
    cover_image?: string;
}

interface Post {
    id: number;
    user_id: number;
    content: string;
    image_url?: string;
    created_at: string;
    likes: number;
}

const UserSpace = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (!id) return;
        axios.get(`/api/users/${id}`).then((res) => setUser(res.data));
        axios.get(`/api/posts/user/${id}`).then((res) => setPosts(res.data));
    }, [id]);

    if (!user) return <div>Laddar...</div>;

    return (
        <main className={styles.main}>
            {/* Återanvänd layout från PersonalSpace */}
            <section className={styles.coverImage}>
                <img
                    src={
                        user.cover_image
                            ? `http://localhost:5000${user.cover_image}`
                            : '/images/default_cover_2.png'
                    }
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/default_cover_2.png';
                    }}
                    alt="Omslagsbild"
                    className={styles.coverImageDisplay}
                />
            </section>
            <div className={styles.profileImageWrapper}>
                <img
                    className={styles.profileImage}
                    src={
                        user.profile_picture
                            ? `http://localhost:5000${user.profile_picture}`
                            : '/images/default_profile.png'
                    }
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/default_profile.png';
                    }}
                    alt="Profile"
                />
            </div>
            <section className={styles.profileWrapper}>
                <div className={styles.username}>{user.username}</div>
                <section className={styles.userInfoWrapper}>
                    <div>
                        Förnamn:{' '}
                        <span className={styles.firstnameValue}>
                            {user.firstname}
                        </span>
                    </div>
                    <div>
                        Efternamn:{' '}
                        <span className={styles.lastnameValue}>
                            {user.lastname}
                        </span>
                    </div>
                    <div>
                        E-mail:{' '}
                        <span className={styles.emailValue}>{user.email}</span>
                    </div>
                    <div className={styles.sectionDivider}></div>
                    <div className={styles.aboutMeWrapper}>
                        <span className={styles.aboutMeHeading}>Om mig:</span>
                        <p className={styles.aboutMeContent}>{user.bio}</p>
                    </div>
                </section>
                {/* Visa användarens inlägg */}
                <section className={styles.postsWrapper}>
                    <div className={styles.posts}>
                        {posts.length === 0 && <p>Inga inlägg än...</p>}
                        {posts.map((post) => (
                            <div key={post.id} className={styles.postItem}>
                                <p>{post.content}</p>
                                <span>{post.likes} likes</span>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
};

export default UserSpace;
