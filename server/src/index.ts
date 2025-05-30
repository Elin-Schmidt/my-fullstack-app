import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRouter'; // auth.ts
import usersRouter from './routes/usersRouter'; // users.ts
import postsRouter from './routes/postsRouter'; // posts.ts
import notesRouter from './routes/notesRouter'; // notes.ts
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
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Lägg till PATCH här!
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
        next();
    }
);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes först!
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/notes', notesRouter);

if (process.env.SERVE_FRONTEND === 'true') {
    // Serve static files from the frontend
    app.use(express.static(path.resolve(__dirname, '../../client/dist')));

    // SPA fallback
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
app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('__dirname:', __dirname);
console.log(
    'Förväntad index.html:',
    path.join(process.cwd(), 'client/dist/index.html')
);
