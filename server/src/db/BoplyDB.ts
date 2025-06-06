import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (_err: Error, res: { rows: unknown[] }) => {
    if (_err) {
        console.error('Database connection error:', _err);
    } else {
        console.log('Successfully connected to the database:', res.rows[0]);
    }
});

pool.query('SELECT * FROM users', (_err, res) => {
    if (_err) {
        console.error('Database query error:', _err);
    } else {
        console.log('Users in database:', res.rows);
    }
});

export default pool;
