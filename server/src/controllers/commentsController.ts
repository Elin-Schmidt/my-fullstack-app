import { RequestHandler } from 'express';

import db from '../db/BoplyDB';

interface Comment {
    id: number;
    user_id: number;
    post_id: number;
    content: string;
    created_at: Date;
    username?: string;
}

// GET-kommentarer för ett inlägg
export const getComments: RequestHandler = async (req, res) => {
    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
        res.status(400).json({ error: 'Invalid post ID' });
        return;
    }
    try {
        const result = await db.query(
            `SELECT c.*, u.username
             FROM comments c
             JOIN users u ON u.id = c.user_id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`,
            [postId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST-kommentar för ett inlägg
export const createComment: RequestHandler = async (req, res) => {
    const postId = Number(req.params.postId);
    const { content, userId } = req.body;
    if (isNaN(postId) || !content || !userId) {
        res.status(400).json({ error: 'postId, userId och content krävs' });
    }
    try {
        // Skapa kommentaren
        const insertResult = await db.query(
            `INSERT INTO comments (user_id, post_id, content)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, postId, content]
        );
        const comment = insertResult.rows[0];

        // Hämta username via JOIN
        const userResult = await db.query(
            `SELECT username FROM users WHERE id = $1`,
            [userId]
        );
        const username = userResult.rows[0]?.username;

        res.status(201).json({ ...comment, username });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
