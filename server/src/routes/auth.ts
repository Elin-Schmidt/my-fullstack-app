// server/routes/auth.ts
import express, { Request, Response, Router, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../db/BoplyDB'; // Adjusted to use default import

dotenv.config();

const router: Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// ============================
// Typ för inkommande body
// ============================
interface LoginRequestBody {
    email: string;
    password: string;
}

// ============================
// Typat och refaktorerat login-endpoint
// ============================
const loginHandler = async (
    req: Request<{}, any, LoginRequestBody>,
    res: Response
): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required.' });
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

        if (!user.password) {
            res.status(500).json({
                message: 'No password found for this user.'
            });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username
            },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profile_picture: user.profile_picture,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// ============================
// Route bindning
// ============================
router.post('/login', loginHandler);

export default router;
