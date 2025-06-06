import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../db/BoplyDB';

interface RegisterRequestBody {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    profile_picture?: string;
}

export const createAccount = async (
    req: Request<object, object, RegisterRequestBody>,
    res: Response
): Promise<void> => {
    const { username, firstname, lastname, email, password, profile_picture } =
        req.body;

    if (!username || !firstname || !lastname || !email || !password) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await db.query(
            `INSERT INTO users (username, firstname, lastname, email, password, profile_picture)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                username,
                firstname,
                lastname,
                email,
                hashedPassword,
                profile_picture || null
            ]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error: unknown) {
        if (
            error &&
            typeof error === 'object' &&
            'code' in error &&
            (error as { code?: string }).code === '23505'
        ) {
            res.status(400).json({
                message: 'Email or username already exists'
            });
        } else {
            res.status(500).json({
                message: 'Server error during registration'
            });
        }
    }
};
