import { ChangeEvent, useEffect, useState } from 'react';
import styles from './PersonalSpace.module.css';
import { uploadProfilePicture } from '@/utils/uploadProfilePicture.ts';
import { Camera } from 'lucide-react';

interface User {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    profile_picture?: string;
    bio: string;
}

function PersonalSpace() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Hämta användar-id från localStorage (eller context)
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const { id } = JSON.parse(userData);

        fetch(`/api/users/${id}`)
            .then((res) => res.json())
            .then((data) => setUser(data));
    }, []);
    const handleProfilePictureChange = async (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            const updatedUser = await uploadProfilePicture(file, user.username);
            setUser(updatedUser);
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <div>Laddar...</div>;

    return (
        <main className={styles.main}>
            <section className={styles.coverImage}>
                <img src="#" alt="Omslagsbild" />
            </section>
            <div
                className={styles.profileImageWrapper}
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '100px',
                    transform: 'translateX(-50%)',
                    zIndex: 2
                }}
            >
                <div className={styles.imageHoverWrapper}>
                    <img
                        className={styles.profileImage}
                        src={user.profile_picture || '#'}
                        alt="Profile Picture"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className={styles.uploadInput}
                        id="upload-input"
                    />
                    <label
                        htmlFor="upload-input"
                        className={styles.iconOverlay}
                    >
                        <Camera size={20} color="white" />
                    </label>
                </div>
            </div>
            <section className={styles.profileWrapper}>
                <section className={styles.iconWrapper}>
                    <div className={styles.addFriend}></div>
                    <div className={styles.sendMessage}></div>
                </section>
                <div className={styles.username}>{user.username}</div>
                <section className={styles.userInfoWrapper}>
                    <div className={styles.firstname}>{user.firstname}</div>
                    <div className={styles.lastname}>{user.lastname}</div>
                    <div className={styles.email}>{user.email}</div>
                    <label htmlFor="about">
                        <p className={styles.aboutMeHeading}>Om mig</p>
                        <p className={styles.aboutMeContent}>{user.bio}</p>
                        <span></span>
                    </label>
                </section>
                <section className={styles.friendsWrapper}>
                    <div className={styles.friendList}></div>
                </section>
                <section className={styles.postsWrapper}>
                    <div className={styles.posts}></div>
                    <div className={styles.postLikes}>
                        <div className={styles.likesIcon}></div>
                        <div className={styles.likesCount}>0</div>
                    </div>
                    <div className={styles.postCreated}></div>
                    <div className={styles.commentWrapper}>
                        <div className={styles.comment}></div>
                        <div className={styles.commentFrom}></div>
                    </div>
                </section>
            </section>
        </main>
    );
}

export default PersonalSpace;
