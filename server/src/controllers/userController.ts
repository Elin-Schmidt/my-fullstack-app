import { Request, Response } from 'express';
import db from '../db/BoplyDB';
import path from 'path';
import fs from 'fs';

// GET alla användare
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const result = await db.query(
            'SELECT id, username, profile_picture FROM users'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Fel vid hämtning av användare:', error);
        res.status(500).json({ message: 'Kunde inte hämta användare' });
    }
};

// GET enskild användare
export const getUserById = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Fel vid hämtning av användare:', error);
        res.status(500).json({ message: 'Serverfel' });
    }
};

// PUT - uppdatera användare
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, firstname, lastname, email, bio } = req.body;

    try {
        const result = await db.query(
            `UPDATE users
             SET username = $1, firstname = $2, lastname = $3, email = $4, bio = $5
             WHERE id = $6
             RETURNING *`,
            [username, firstname, lastname, email, bio, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ message: 'Användaren uppdaterad', user: result.rows[0] });
    } catch (error) {
        console.error('Fel vid uppdatering:', error);
        res.status(500).json({ message: 'Kunde inte uppdatera användaren' });
    }
};

// POST - profilbild
export const uploadProfilePicture = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const file = req.file;

    if (!file) {
        res.status(400).json({ message: 'Ingen fil uppladdad' });
        return;
    }

    const imagePath = `/uploads/profilepic/${file.filename}`;

    try {
        const userResult = await db.query(
            'SELECT profile_picture FROM users WHERE id = $1',
            [userId]
        );
        const oldImagePath = userResult.rows[0]?.profile_picture;

        if (oldImagePath) {
            const fullPath = path.join(__dirname, '../../', oldImagePath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }

        const result = await db.query(
            'UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING *',
            [imagePath, userId]
        );

        res.json({ message: 'Profilbild uppladdad', user: result.rows[0] });
    } catch (error) {
        console.error('Fel vid uppladdning:', error);
        res.status(500).json({ message: 'Kunde inte spara profilbilden' });
    }
};

// POST - omslagsbild
export const uploadCoverImage = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const file = req.file;

    if (!file) {
        res.status(400).json({ message: 'Ingen fil uppladdad' });
        return;
    }

    const imagePath = `/uploads/coverpic/${file.filename}`;

    try {
        const userResult = await db.query(
            'SELECT cover_image FROM users WHERE id = $1',
            [userId]
        );
        const oldCoverPath = userResult.rows[0]?.cover_image;

        if (oldCoverPath) {
            const fullPath = path.join(__dirname, '../../', oldCoverPath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }

        const result = await db.query(
            'UPDATE users SET cover_image = $1 WHERE id = $2 RETURNING *',
            [imagePath, userId]
        );

        res.json({ message: 'Omslagsbild uppladdad', user: result.rows[0] });
    } catch (error) {
        console.error('Fel vid uppladdning:', error);
        res.status(500).json({ message: 'Kunde inte spara omslagsbilden' });
    }
};
