import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth'; // auth.ts
import cors from 'cors';
import path from 'path';
dotenv.config();

const app = express();
app.use(express.json());

app.use(
    cors({
        origin:
            process.env.NODE_ENV === 'production'
                ? 'https://boply.onrender.com'
                : 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    })
);

app.use(
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.log(`Inkommande förfrågan: ${req.method} ${req.url}`);
        console.log('Body:', req.body);
        next();
    }
);

app.use('/api/auth', authRoutes);

app.use(express.static(path.resolve(__dirname, '../../client/dist')));

app.get('*', (req, res) => {
    if (!req.url.startsWith('/api')) {
        res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'));
    } else {
        res.status(404).send('API route not found');
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});
