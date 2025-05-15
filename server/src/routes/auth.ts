import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../db/BoplyDB';

const router = express.Router();

interface RegisterRequestBody {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    profile_picture?: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}

router.post(
    '/register',
    async (
        req: Request<object, object, RegisterRequestBody>, // Byt ut {} mot object
        res: Response
    ): Promise<void> => {
        console.log('📨 [REGISTER] Begäran mottagen:', req.body);

        const {
            username,
            firstname,
            lastname,
            email,
            password,
            profile_picture
        } = req.body;

        if (!username || !firstname || !lastname || !email || !password) {
            console.log('❌ [REGISTER] Saknas fält i begäran');
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        try {
            console.log('🔐 [REGISTER] Hashar lösenord...');
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            console.log(
                '💾 [REGISTER] Försöker spara användare i databasen...'
            );
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

            console.log('✅ [REGISTER] Användare registrerad:', email);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error: unknown) {
            console.error('💥 [REGISTER] Fel vid registrering:', error);

            if (error instanceof Error && 'code' in error) {
                if (error.code === '23505') {
                    console.log(
                        '⚠️ [REGISTER] E-post eller användarnamn finns redan'
                    );
                    res.status(400).json({
                        message: 'Email or username already exists'
                    });
                    return;
                }
            }
            res.status(500).json({
                message: 'Server error during registration'
            });
        }
    }
);

router.post(
    '/login',
    async (
        req: Request<object, object, LoginRequestBody>, // Byt ut {} mot object
        res: Response
    ): Promise<void> => {
        console.log('📨 [LOGIN] Begäran mottagen:', req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            console.log('❌ [LOGIN] Saknas e-post eller lösenord');
            res.status(400).json({
                message: 'Email and password are required.'
            });
            return;
        }

        try {
            console.log(`🔍 [LOGIN] Söker användare i databasen för: ${email}`);
            const result = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                console.log('❌ [LOGIN] Användare hittades inte');
                res.status(401).json({ message: 'Invalid email or password.' });
                return;
            }

            const user = result.rows[0];
            console.log('✅ [LOGIN] Användare hittad:', user.email);

            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordCorrect) {
                console.log('❌ [LOGIN] Fel lösenord');
                res.status(401).json({ message: 'Invalid email or password.' });
                return;
            }

            console.log('✅ [LOGIN] Inloggning lyckades:', user.email);
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('💥 [LOGIN] Fel vid inloggning:', error);
            res.status(500).json({ message: 'Server error during login.' });
        }
    }
);

export default router;
