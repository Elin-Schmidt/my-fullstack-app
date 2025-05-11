// This file is used to connect to the database.
// It uses the pg library to create a connection pool.
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Render kräver SSL
    }
});

module.exports = pool;
