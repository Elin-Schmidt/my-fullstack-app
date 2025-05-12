import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false
});

// Lägg till en enkel testfråga för att se om anslutningen fungerar
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Successfully connected to the database:', res.rows[0]);
    }
});

// Lägg till en fråga för att hämta alla användare
pool.query('SELECT * FROM users', (err, res) => {
    if (err) {
        console.error('Database query error:', err);
    } else {
        console.log('Users in database:', res.rows);
    }
});

// Exportera poolen
export default pool;
