import { RequestHandler } from 'express';
import db from '../db/BoplyDB';

type CreatePostBody = {
    userId: number;
    content: string;
    image_url?: string;
    likes?: number;
};

// GET /api/posts/user/:userId
export const getUserPosts: RequestHandler<{ userId: string }> = async (
    req,
    res
) => {
    console.log('[getUserPosts] Called with userId:', req.params.userId);
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
    }

    try {
        const result = await db.query(
            `SELECT p.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', c.id,
                            'content', c.content,
                            'created_at', c.created_at,
                            'user_id', c.user_id,
                            'username', u.username
                        )
                    ) FILTER (WHERE c.id IS NOT NULL), '[]'
                ) AS comments,
                json_build_object(
                    'id', u.id,
                    'username', u.username,
                    'email', u.email
                ) AS user
            FROM posts p
            LEFT JOIN comments c ON c.post_id = p.id
            LEFT JOIN users u ON u.id = p.user_id
            WHERE p.user_id = $1
            GROUP BY p.id, u.id
            ORDER BY p.created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/posts
export const createPost: RequestHandler<
    unknown,
    unknown,
    CreatePostBody
> = async (req, res) => {
    const { userId, content, image_url } = req.body;

    if (typeof userId !== 'number' || !content) {
        res.status(400).json({ error: 'userId and content are required' });
        return;
    }

    try {
        const result = await db.query(
            `INSERT INTO posts (user_id, content, image_url, created_at)
             VALUES ($1, $2, $3, NOW())
             RETURNING *`,
            [userId, content, image_url || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// PATCH /api/posts/:id/like
export const likePost: RequestHandler<{ id: string }> = async (req, res) => {
    const postId = parseInt(req.params.id, 10);

    if (isNaN(postId)) {
        res.status(400).json({ message: 'Invalid post ID' });
        return;
    }

    try {
        const result = await db.query<{ likes: number }>(
            'SELECT likes FROM posts WHERE id = $1',
            [postId]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        const currentLikes = result.rows[0].likes || 0;

        const updateResult = await db.query(
            'UPDATE posts SET likes = $1 WHERE id = $2 RETURNING *',
            [currentLikes + 1, postId]
        );

        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
