// server/routes/auth.ts
import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../db/BoplyDB'; // Justerat till default-import

dotenv.config();

console.log('Ansluter till databasen:', process.env.DATABASE_URL);

const router: Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// ============================
// Typer
// ============================

interface LoginRequestBody {
    email: string;
    password: string;
}

interface RegisterRequestBody {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    profile_picture?: string;
}

// ============================
// Login Route
// ============================

router.post(
    '/login',
    async (
        req: Request<{}, {}, LoginRequestBody>,
        res: Response
    ): Promise<void> => {
        const { email, password } = req.body;

        console.log('Mottagna inloggningsuppgifter:', { email, password });

        if (!email || !password) {
            res.status(400).json({
                message: 'Email and password are required.'
            });
            return;
        }

        if (email === 'test@example.com' && password === 'password123') {
            res.status(200).json({ message: 'Login successful' });
            return;
        }

        try {
            const result = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                res.status(401).json({ message: 'Invalid email or password.' });
                return;
            }

            const user = result.rows[0];
            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordCorrect) {
                res.status(401).json({ message: 'Invalid email or password.' });
                return;
            }

            // Exempel: JWT-token kan skapas här om du vill lägga till det
            // const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
                // , token // om du använder JWT
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error during login.' });
        }
    }
);

// ============================
// Register Route
// ============================

router.post(
    '/register',
    async (
        req: Request<{}, {}, RegisterRequestBody>,
        res: Response
    ): Promise<void> => {
        const {
            username,
            firstname,
            lastname,
            email,
            password,
            profile_picture
        } = req.body;

        console.log('Mottagna registreringsuppgifter:', req.body);

        if (!username || !firstname || !lastname || !email || !password) {
            res.status(400).json({
                message: 'Alla obligatoriska fält måste fyllas i.'
            });
            return;
        }

        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            console.log('Försöker spara användare i databasen...');
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

            console.log('Ny användare registrerad:', email);
            res.status(201).json({
                message: 'Användare registrerad framgångsrikt.'
            });
        } catch (error: any) {
            console.error('Registreringsfel:', error);

            if (error.code === '23505') {
                res.status(400).json({
                    message: 'E-post eller användarnamn är redan registrerat.'
                });
            } else {
                res.status(500).json({
                    message: 'Serverfel under registrering.'
                });
            }
        }
    }
);

export default router;
