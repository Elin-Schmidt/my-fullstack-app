/* === IMPORTS === */
import { ChangeEvent, useEffect, useState } from 'react';
import styles from './PersonalSpace/PersonalSpace.module.css';
import axios, { isAxiosError } from 'axios';
import { uploadProfilePicture } from '@/utils/uploadProfilePicture.ts';
import { uploadCoverImage } from '@/utils/uploadCoverImage.ts';
import { Camera } from 'lucide-react';
import PostForm from '../layout/PostForm/PostForm.tsx';
import { useAppContext } from '../../context/LoginHandler.tsx';
import { API_BASE_URL } from '../../utils/api.ts';

/* === INTERFACES === */
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
    comments?: Comment[];
}
interface Comment {
    id: number;
    content: string;
    username: string;
    created_at: string;
}

/* === COMPONENT === */
function PersonalSpace() {
    /* === STATE === */
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [openCommentFor, setOpenCommentFor] = useState<number | null>(null);
    const [commentInput, setCommentInput] = useState<string>('');
    const { user: currentUser } = useAppContext();

    /* === IMAGE HANDLERS === */
    const handleCoverImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            const updatedUser = await uploadCoverImage(
                file,
                user.id.toString()
            );
            setUser(updatedUser.user);
        } catch (error) {
            if (isAxiosError(error)) {
                console.error(
                    'Axios error:',
                    error.response?.data || error.message
                );
            } else {
                console.error('Unexpected error:', error);
            }
        } finally {
            // Den här koden körs alltid, oavsett fel eller ej
            e.target.value = ''; // Töm fil-input så användaren kan välja samma fil igen
        }
    };

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
            setUser(updatedUserResponse.user);
        } catch (error) {
            if (isAxiosError(error)) {
                console.error(
                    'Axios error:',
                    error.response?.data || error.message
                );
            } else {
                console.error('Unexpected error:', error);
            }
        } finally {
            e.target.value = ''; // Rensa input så användaren kan ladda upp samma fil igen
        }
    };

    /* === FETCH USER + POSTS === */
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        try {
            const parsedUser: { id: number } = JSON.parse(userData);
            const { id } = parsedUser;

            // Hämta användardata
            axios
                .get<User>(`${API_BASE_URL}/api/users/${id}`)
                .then((res) => setUser(res.data))
                .catch(console.error);

            // Hämta poster för användaren
            axios
                .get<Post[]>(`${API_BASE_URL}/api/posts/user/${id}`)
                .then((res) =>
                    setPosts(
                        res.data.map((post) => ({
                            ...post,
                            likes: post.likes || 0
                        }))
                    )
                )
                .catch(console.error);
        } catch (e) {
            console.error('Failed to parse user data:', e);
        }
    }, []);

    /* === ADD POST === */
    const addPost = async (content: string) => {
        if (!user) return;

        try {
            const res = await axios.post(`${API_BASE_URL}/api/posts`, {
                userId: user.id,
                content
            });
            setPosts((prev) => [res.data, ...prev]);
        } catch (error) {
            if (isAxiosError(error)) {
                console.error(
                    'Axios error:',
                    error.response?.data || error.message
                );
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    // Like handler implementation
    const likeHandler = async (id: number) => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/posts/${id}/like`
            );
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === id ? { ...post, likes: res.data.likes } : post
                )
            );

            // Lägg till post i likedPosts för att visa feedback
            setLikedPosts((prev) => [...prev, id]);

            // Ta bort efter 3 sekunder så feedbacken försvinner
            setTimeout(() => {
                setLikedPosts((prev) => prev.filter((postId) => postId !== id));
            }, 3000);
        } catch (error) {
            if (isAxiosError(error)) {
                console.error(
                    'Axios error:',
                    error.response?.data || error.message
                );
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    const handleAddComment = async (postId: number, content: string) => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/posts/${postId}/comments`,
                {
                    content
                }
            );
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              comments: [...(post.comments || []), res.data]
                          }
                        : post
                )
            );
            setCommentInput('');
            setOpenCommentFor(null);
        } catch (error) {
            if (isAxiosError(error)) {
                console.error(
                    'Axios error:',
                    error.response?.data || error.message
                );
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    /* === TEMPLATE === */
    if (!user) return <div>Laddar...</div>;

    return (
        <main className={styles.main}>
            {/* === COVER IMAGE === */}
            <section className={styles.coverImage}>
                <div className={styles.coverImageHoverWrapper}>
                    <img
                        src={
                            user.cover_image
                                ? `${API_BASE_URL}${user.cover_image}`
                                : '/images/default_cover_2.png'
                        }
                        onError={(e) => {
                            e.currentTarget.onerror = null;
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

            {/* === PROFILE IMAGE === */}
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
                                ? `${API_BASE_URL}${user.profile_picture}`
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

            {/* === PROFILE SECTION === */}
            <section className={styles.profileWrapper}>
                {/* === ICONS === */}
                <section className={styles.iconWrapper}>
                    <div className={styles.addFriend}></div>
                    <div className={styles.sendMessage}></div>
                </section>

                {/* === USERNAME === */}
                <div className={styles.username}>{user.username}</div>

                {/* === USER INFO === */}
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

                    {/* === DIVIDER === */}
                    <div className={styles.sectionDivider}></div>

                    {/* === BIO === */}
                    <div className={styles.aboutMeWrapper}>
                        <span className={styles.aboutMeHeading}>Om mig:</span>
                        <p className={styles.aboutMeContent}>{user.bio}</p>
                    </div>
                </section>

                {/* === FÖLJARE === */}
                <section className={styles.followWrapper}>
                    <div className={styles.followList}>
                        <div className={styles.following}>
                            Vilka jag följer:
                            <span className={styles.followingPicture}></span>
                            <span className={styles.followingUsername}></span>
                        </div>
                        <div className={styles.sectionDivider}></div>
                        <div className={styles.followers}>
                            Vilka följer mig:
                            <span className={styles.followersPicture}></span>
                            <span className={styles.followersUsername}></span>
                        </div>
                    </div>
                </section>

                {/* === POSTS === */}
                <section className={styles.postsWrapper}>
                    <PostForm onAddPost={addPost} />
                    <div className={styles.posts}>
                        {posts.length === 0 && <p>Inga inlägg än...</p>}
                        {posts.map((post) => (
                            <div key={post.id} className={styles.postItem}>
                                <p>{post.content}</p>
                                {/* ... datum, likes, etc */}
                                <div className={styles.postLikes}>
                                    <button
                                        className={`${styles.likeButton} ${
                                            post.user_id === currentUser?.id
                                                ? styles.disabled
                                                : ''
                                        }`}
                                        onClick={
                                            post.user_id !== currentUser?.id
                                                ? () => likeHandler(post.id)
                                                : undefined
                                        }
                                        disabled={
                                            post.user_id === currentUser?.id
                                        }
                                    >
                                        ❤️
                                    </button>
                                    <span>{post.likes}</span>

                                    {/* Visa feedback när post.id finns i likedPosts */}
                                    {likedPosts.includes(post.id) && (
                                        <span className={styles.likeFeedback}>
                                            Gillat!
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setOpenCommentFor(post.id)}
                                >
                                    Kommentera
                                </button>
                                {openCommentFor === post.id && (
                                    <div className={styles.commentFlyout}>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleAddComment(
                                                    post.id,
                                                    commentInput
                                                );
                                            }}
                                        >
                                            <textarea
                                                value={commentInput}
                                                onChange={(e) =>
                                                    setCommentInput(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Skriv en kommentar..."
                                            />
                                            <button type="submit">
                                                Skicka
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Visa kommentarer */}
                                <div className={styles.commentsSection}>
                                    {post.comments?.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className={styles.commentItem}
                                        >
                                            <div
                                                className={
                                                    styles.commentContent
                                                }
                                            >
                                                {comment.content}
                                            </div>
                                            <div className={styles.commentMeta}>
                                                {comment.username} •{' '}
                                                {new Date(
                                                    comment.created_at
                                                ).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* === COMMENTS === */}
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
