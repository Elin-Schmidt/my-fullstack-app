import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PersonalSpace/PersonalSpace.module.css';
import axios from 'axios';
import { FaHeart, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import { useAppContext } from '../../context/LoginHandler.tsx';
import { API_BASE_URL } from '../../utils/api.ts';

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

interface Comment {
    id: number;
    post_id: number;
    content: string;
    username: string;
    created_at: string;
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

const UserSpace = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const { user: currentUser } = useAppContext();
    const [openCommentFor, setOpenCommentFor] = useState<number | null>(null);
    const [commentInput, setCommentInput] = useState('');
    const commentFormRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!id) return;
        axios
            .get(`${API_BASE_URL}/api/users/${id}`)
            .then((res) => setUser(res.data));
        axios.get(`${API_BASE_URL}/api/posts/user/${id}`).then(async (res) => {
            const postsWithComments = await Promise.all(
                res.data.map(async (post: Post) => {
                    const commentsRes = await axios.get<Comment[]>(
                        `${API_BASE_URL}/api/posts/${post.id}/comments`
                    );
                    return { ...post, comments: commentsRes.data };
                })
            );
            setPosts(postsWithComments);
        });
    }, [id]);

    useEffect(() => {
        if (openCommentFor === null) return;
        function handleClickOutside(event: MouseEvent) {
            if (
                commentFormRef.current &&
                !commentFormRef.current.contains(event.target as Node)
            ) {
                setOpenCommentFor(null);
                setCommentInput('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openCommentFor]);

    const likeHandler = async (postId: number) => {
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/api/posts/${postId}/like`
            );
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, likes: res.data.likes }
                        : post
                )
            );
        } catch (error) {
            console.error('Kunde inte gilla post:', error);
        }
    };

    const handleAddComment = async (postId: number, content: string) => {
        if (!currentUser) return;
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/posts/${postId}/comments`,
                {
                    userId: currentUser.id,
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
            console.error('Kunde inte posta kommentar:', error);
        }
    };

    if (!user) return <div>Laddar...</div>;

    return (
        <main className={styles.main}>
            {/* COVER IMAGE */}
            <section className={styles.coverImage}>
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
            </section>

            {/* === PROFILE TOP === */}
            <div className={styles.profileTop}>
                <div className={styles.profileImageWrapper}>
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
                                e.currentTarget.src =
                                    '/images/default_profile.png';
                            }}
                            alt="Profile Picture"
                        />
                    </div>
                </div>
                <div className={styles.profileIcons}>
                    <button
                        className={styles.iconButton}
                        title="Lägg till som följare"
                    >
                        <FaUserPlus size={22} />
                    </button>
                    <button
                        className={styles.iconButton}
                        title="Skicka meddelande"
                    >
                        <FaEnvelope size={22} />
                    </button>
                </div>
            </div>

            {/* PROFILE SECTION */}
            <section className={styles.profileWrapper}>
                <div className={styles.username}>
                    <p className={styles.usernameStyled}>{user.username}</p>
                    <p className={styles.usernameText}>{user.username}</p>
                </div>
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

                {/* POSTS */}
                <section className={styles.postsWrapper}>
                    <div className={styles.posts}>
                        {posts.length === 0 && <p>Inga inlägg än...</p>}
                        {posts.map((post) => (
                            <div key={post.id} className={styles.postItem}>
                                <p>{post.content}</p>
                                <div className={styles.postLikes}>
                                    <button
                                        className={styles.likeButton}
                                        onClick={() => likeHandler(post.id)}
                                        disabled={
                                            post.user_id === currentUser?.id
                                        }
                                        title={
                                            post.user_id === currentUser?.id
                                                ? 'Du kan inte gilla dina egna inlägg'
                                                : 'Gilla inlägg'
                                        }
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor:
                                                post.user_id === currentUser?.id
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                            padding: 0,
                                            marginRight: '6px',
                                            fontSize: '1.2rem',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FaHeart
                                            color={
                                                post.user_id === currentUser?.id
                                                    ? '#ccc'
                                                    : '#e25555'
                                            }
                                            style={{
                                                verticalAlign: 'middle'
                                            }}
                                        />
                                    </button>
                                    <span>{post.likes}</span>
                                </div>
                                <div className={styles.commentButtonWrapper}>
                                    <button
                                        className={`${styles.commentButton} ${
                                            openCommentFor === post.id
                                                ? styles.commentButtonInactive
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setOpenCommentFor(post.id)
                                        }
                                        disabled={openCommentFor === post.id}
                                    >
                                        💬 Kommentera
                                    </button>
                                </div>
                                {openCommentFor === post.id && (
                                    <div
                                        className={styles.commentFormWrapper}
                                        ref={commentFormRef}
                                    >
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
                                                className={
                                                    styles.commentTextarea
                                                }
                                                value={commentInput}
                                                onChange={(e) =>
                                                    setCommentInput(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Skriv en kommentar..."
                                            />
                                            <div
                                                className={
                                                    styles.commentFormActions
                                                }
                                            >
                                                <button
                                                    type="submit"
                                                    className={
                                                        styles.commentButton
                                                    }
                                                >
                                                    Skicka
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                <div className={styles.commentsSection}>
                                    {post.comments
                                        ?.slice()
                                        .sort(
                                            (a, b) =>
                                                new Date(
                                                    b.created_at
                                                ).getTime() -
                                                new Date(a.created_at).getTime()
                                        )
                                        .map((comment) => (
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
                                                <div
                                                    className={
                                                        styles.commentMeta
                                                    }
                                                >
                                                    {comment.username} •{' '}
                                                    {new Date(
                                                        comment.created_at
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
};

export default UserSpace;
