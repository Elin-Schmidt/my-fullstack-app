import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../db/BoplyDB';

interface LoginRequestBody {
    email: string;
    password: string;
}

export const loginUser = async (
    req: Request<object, object, LoginRequestBody>,
    res: Response
): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: 'Email and password are required.'
        });
        return;
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [
            email
        ]);

        if (result.rows.length === 0) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }

        const user = result.rows[0];

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
