const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
require('dotenv').config();

app.use(express.json()); // Viktigt för att kunna läsa JSON-kroppar från requesten

app.use('/api', authRoutes); // Alla autentisering-related routes börjar med /api

const PORT = process.env.serverPORT || 8000;
app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});
