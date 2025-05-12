import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth'; // auth.ts
dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});
