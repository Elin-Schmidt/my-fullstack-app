import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRouter';
import usersRouter from './routes/usersRouter';
import postsRouter from './routes/postsRouter';
import notesRouter from './routes/notesRouter';
import cors from 'cors';
import path from 'path';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
    res.send('Root test works!');
});

app.use(
    cors({
        origin:
            process.env.NODE_ENV === 'production'
                ? 'https://boply.onrender.com'
                : 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true
    })
);

app.use(
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        next();
    }
);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/notes', notesRouter);

if (process.env.SERVE_FRONTEND === 'true') {
    app.use(express.static(path.resolve(__dirname, '../../client/dist')));

    app.use((req, res, next) => {
        if (!req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
            res.sendFile(
                path.resolve(__dirname, '../../client/dist/index.html')
            );
        } else {
            next();
        }
    });
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {});
