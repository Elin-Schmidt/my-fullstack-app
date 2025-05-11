// server/routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db/BoplyDB'); // Importera din databasanslutning
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Lägg till detta om Render kräver SSL
    }
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log('Connection error:', err.stack);
    } else {
        console.log('Connected to database:', res.rows);
    }
});
router.post('/create-account', async (req, res) => {
    const { username, email, password, profile_picture } = req.body;

    // Kontrollera om alla fält finns
    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ message: 'Username, email and password are required' });
    }

    try {
        // Kontrollera om e-post eller användarnamn redan finns i databasen
        const existingUser = await db.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res
                .status(409)
                .json({ message: 'Email or username is already taken' });
        }

        // Kryptera lösenordet
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lägg till användaren i databasen
        const result = await db.query(
            `INSERT INTO users (username, email, password, profile_picture)
             VALUES ($1, $2, $3, $4)
             RETURNING id, username, email, profile_picture, created_at`,
            [username, email, hashedPassword, profile_picture || null]
        );

        const user = result.rows[0];

        // Skicka tillbaka ett svar med den skapade användaren
        return res.status(201).json({
            message: 'Account created successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profile_picture: user.profile_picture,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Error during account creation:', error);
        return res
            .status(500)
            .json({ message: 'Error creating account', error: error.message });
    }
});

module.exports = router;
