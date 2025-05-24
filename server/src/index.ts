import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRouter'; // auth.ts
import usersRouter from './routes/usersRouter ';
import postsRouter from './routes/postsRouter'; // posts.ts
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

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

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
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.SERVE_FRONTEND === 'true') {
    // Serve static files from the frontend
    app.use(express.static(path.resolve(__dirname, '../client/dist')));

    // Serve frontend for unknown routes
    app.use((req, res, next) => {
        if (!req.url.startsWith('/api')) {
            res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
        } else {
            next();
        }
    });
}

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users/all-users', usersRouter);
app.use('/api/posts', postsRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});
