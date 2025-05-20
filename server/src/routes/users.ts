import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import db from '../db/BoplyDB';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // filändelsen från originalfilen
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + ext);
    }
});

const upload = multer({ storage });

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await db.query(
            'SELECT id, username, firstname, lastname, email, profile_picture, bio, cover_image FROM users WHERE id = $1',
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

router.post(
    '/:userId/upload-profile-picture',
    upload.single('profile_picture'),
    async (req, res) => {
        const userId = req.params.userId;
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'Ingen fil uppladdad' });
            return;
        }

        const imagePath = `/uploads/${file.filename}`;

        try {
            // Uppdatera användaren
            const result = await db.query(
                'UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING *',
                [imagePath, userId]
            );

            const updatedUser = result.rows[0];

            res.json({
                message: 'Profilbild uppladdad och sparad i databasen',
                user: updatedUser
            });
        } catch (error) {
            console.error('Fel vid uppdatering av profilbild:', error);
            res.status(500).json({ message: 'Kunde inte spara profilbilden' });
        }
    }
);

export default router;
