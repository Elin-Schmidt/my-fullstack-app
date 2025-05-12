import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Render kräver SSL
    }
});

// Lägg till en enkel testfråga för att se om anslutningen fungerar
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Successfully connected to the database:', res.rows[0]);
    }
});

// Exportera poolen
export default pool;
