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
        const result = await db.query('SELECT * FROM users WHERE email = $1', [
            email
        ]);

        if (result.rows.length === 0) {
            console.log('❌ [LOGIN] Användare hittades inte');
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }

        const user = result.rows[0];
        console.log('✅ [LOGIN] Användare hittad:', user.email);

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

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
};
