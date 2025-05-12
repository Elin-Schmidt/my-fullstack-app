import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth'; // auth.ts
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173', // Byt ut mot din frontend-URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Tillåtna metoder
        credentials: true // Om du skickar cookies eller autentisering
    })
);

app.use((req, res, next) => {
    console.log(`Inkommande förfrågan: ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});
