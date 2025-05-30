import { Request, Response } from 'express';
import db from '../db/BoplyDB';

export const getUserNotes = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await db.query(
        'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    res.json(result.rows);
};

export const createNote = async (req: Request, res: Response) => {
    const { user_id, content } = req.body;
    const result = await db.query(
        'INSERT INTO notes (user_id, content) VALUES ($1, $2) RETURNING *',
        [user_id, content]
    );
    res.status(201).json(result.rows[0]);
};

export const updateNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content || typeof content !== 'string') {
            return res
                .status(400)
                .json({ error: 'Content krävs och måste vara en sträng.' });
        }

        const result = await db.query(
            'UPDATE notes SET content = $1 WHERE id = $2 RETURNING *',
            [content, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Anteckning hittades inte' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Fel vid uppdatering av anteckning:', error);
        res.status(500).json({
            error: 'Serverfel vid uppdatering av anteckning.'
        });
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.query('DELETE FROM notes WHERE id = $1', [id]);
    res.status(204).end();
};
