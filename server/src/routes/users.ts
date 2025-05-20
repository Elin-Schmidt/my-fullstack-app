import express, { Request, Response } from 'express';
import db from '../db/BoplyDB';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await db.query(
            'SELECT username, firstname, lastname, email, profile_picture, bio FROM users WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(result.rows[0]);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
