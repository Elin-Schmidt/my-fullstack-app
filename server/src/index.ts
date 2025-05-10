require('dotenv').config();

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes';
import accountRoutes from './routes/accountRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req: any, res: { send: (arg0: string) => void }) => {
    res.send('Servern är igång!');
});

// Prefixa med /api
app.use('/api/chat', chatRoutes);
app.use('/api/account', accountRoutes);

app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
});
