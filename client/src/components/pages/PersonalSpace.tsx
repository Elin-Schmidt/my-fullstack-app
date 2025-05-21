import { ChangeEvent, useEffect, useState } from 'react';
import styles from './PersonalSpace.module.css';
import { uploadProfilePicture } from '@/utils/uploadProfilePicture.ts';
import { uploadCoverImage } from '@/utils/uploadCoverImage.ts';
import { Camera } from 'lucide-react';

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

function PersonalSpace() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Hämta användar-id från localStorage (eller context)
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const { id } = JSON.parse(userData);

        fetch(`/api/users/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('Hämtad användare:', data);
                setUser(data);
            });
    }, []);

    const handleProfilePictureChange = async (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            const updatedUserResponse = await uploadProfilePicture(
                file,
                user.id.toString()
            );
            setUser(updatedUserResponse.user); // <-- Viktigt!
        } catch (err) {
            console.error(err);
        }
    };

    const handleCoverImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            const updatedUser = await uploadCoverImage(
                file,
                user.id.toString()
            ); // ändra till user.id
            setUser(updatedUser.user);
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <div>Laddar...</div>;

    return (
        <main className={styles.main}>
            <section className={styles.coverImage}>
                <div className={styles.coverImageHoverWrapper}>
                    <img
                        src={
                            user.cover_image
                                ? `http://localhost:5000${user.cover_image}`
                                : '/images/default_cover_2.png'
                        }
                        onError={(e) => {
                            e.currentTarget.onerror = null; // undvik oändlig loop
                            e.currentTarget.src = '/images/default_cover_2.png';
                        }}
                        alt="Omslagsbild"
                        className={styles.coverImageDisplay}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className={styles.uploadInput}
                        id="cover-upload"
                    />
                    <label
                        htmlFor="cover-upload"
                        className={styles.coverIconOverlay}
                    >
                        <Camera size={20} color="white" />
                    </label>
                </div>
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
                        src={
                            user.profile_picture
                                ? `http://localhost:5000${user.profile_picture}`
                                : '/images/default_profile.png'
                        }
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/default_profile.png';
                        }}
                        alt="Profile Picture"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className={styles.uploadInput}
                        id="upload-input"
                    />
                </div>
                <label htmlFor="upload-input" className={styles.iconOverlay}>
                    <Camera size={20} color="white" />
                </label>
            </div>
            <section className={styles.profileWrapper}>
                <section className={styles.iconWrapper}>
                    <div className={styles.addFriend}></div>
                    <div className={styles.sendMessage}></div>
                </section>
                <div className={styles.username}>{user.username}</div>
                <section className={styles.userInfoWrapper}>
                    <div className={styles.firstname}>
                        Förnamn:
                        <span className={styles.firstnameValue}>
                            {user.firstname}
                        </span>
                    </div>
                    <div className={styles.lastname}>
                        Efternamn:
                        <span className={styles.lastnameValue}>
                            {user.lastname}
                        </span>
                    </div>
                    <div className={styles.email}>
                        E-mail:
                        <span className={styles.emailValue}>{user.email}</span>
                    </div>
                    <div className={styles.sectionDivider}></div>
                    <div className={styles.aboutMeWrapper}>
                        <span className={styles.aboutMeHeading}>Om mig:</span>
                        <p className={styles.aboutMeContent}>{user.bio}</p>
                    </div>
                </section>
                <section className={styles.friendsWrapper}>
                    <div className={styles.friendList}></div>
                </section>
                <section className={styles.postsWrapper}>
                    <div className={styles.posts}>Post</div>
                    <div className={styles.postLikes}>
                        <div className={styles.likesIcon}>*heart*</div>
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
