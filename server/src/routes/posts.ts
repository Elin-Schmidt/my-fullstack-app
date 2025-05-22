import express, { Request, Response } from 'express';
import db from '../db/BoplyDB'; // samma pool som i din användar-router

const router = express.Router();

type CreatePostBody = {
    userId: number;
    content: string;
    image_url?: string;
};

// GET /api/posts/:userId - hämta alla posts för en användare
router.get(
    '/user/:userId',
    async (req: Request<{ userId: string }>, res: Response) => {
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
                                'user_id', c.user_id
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
    }
);

// POST /api/posts - skapa en ny post
router.post(
    '/',
    async (req: Request<unknown, unknown, CreatePostBody>, res: Response) => {
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
    }
);

export default router;
