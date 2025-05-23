import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import db from '../db/BoplyDB';
import fs from 'fs';

const router = express.Router();

const profileStorage = multer.diskStorage({
    destination: path.join(__dirname, '../../uploads/profilepic'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
export const uploadProfile = multer({ storage: profileStorage });

// För omslagsbilder
const coverStorage = multer.diskStorage({
    destination: path.join(__dirname, '../../uploads/coverpic'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
export const uploadCover = multer({ storage: coverStorage });

router.get('/', async (_req: Request, res: Response) => {
    try {
        const result = await db.query(
            'SELECT id, username, profile_picture FROM users'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Fel vid hämtning av användare:', error);
        res.status(500).json({ message: 'Kunde inte hämta användare' });
    }
});

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

router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, firstname, lastname, email, bio } = req.body;

    try {
        const result = await db.query(
            `UPDATE users
             SET username = $1,
                 firstname = $2,
                 lastname = $3,
                 email = $4,
                 bio = $5
             WHERE id = $6
             RETURNING id, username, firstname, lastname, email, bio, profile_picture, cover_image`,
            [username, firstname, lastname, email, bio, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            message: 'Användarinformation uppdaterad',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Fel vid uppdatering av användare:', error);
        res.status(500).json({
            message: 'Kunde inte uppdatera användarinformation'
        });
    }
});

router.post(
    '/:userId/upload-profile-picture',
    uploadProfile.single('profile_picture'),
    async (req, res) => {
        const userId = req.params.userId;
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'Ingen fil uppladdad' });
            return;
        }

        const imagePath = `/uploads/profilepic/${file.filename}`;

        try {
            // Hämta nuvarande bildväg
            const userResult = await db.query(
                'SELECT profile_picture FROM users WHERE id = $1',
                [userId]
            );
            const oldImagePath = userResult.rows[0]?.profile_picture;

            // Ta bort gammal bild från filsystemet
            if (oldImagePath) {
                const fullPath = path.join(__dirname, '../../', oldImagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }

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

router.post(
    '/:userId/upload-cover-image',
    uploadCover.single('cover_image'),
    async (req, res) => {
        const userId = req.params.userId;
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'Ingen fil uppladdad' });
            return;
        }

        const imagePath = `/uploads/coverpic/${file.filename}`;

        try {
            // Hämta nuvarande omslagsbild
            const userResult = await db.query(
                'SELECT cover_image FROM users WHERE id = $1',
                [userId]
            );
            const oldCoverPath = userResult.rows[0]?.cover_image;

            // Ta bort gammal omslagsbild
            if (oldCoverPath) {
                const fullPath = path.join(__dirname, '../../', oldCoverPath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }

            // Uppdatera användaren
            const result = await db.query(
                'UPDATE users SET cover_image = $1 WHERE id = $2 RETURNING *',
                [imagePath, userId]
            );

            const updatedUser = result.rows[0];

            res.json({
                message: 'Omslagsbild uppladdad och sparad i databasen',
                user: updatedUser
            });
        } catch (error) {
            console.error('Fel vid uppdatering av omslagsbild:', error);
            res.status(500).json({ message: 'Kunde inte spara omslagsbilden' });
        }
    }
);

export default router;
