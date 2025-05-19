import express from 'express';
import { createAccount } from '../controllers/createAccount';
import { loginUser } from '../controllers/login';

const router = express.Router();

router.post('/register', createAccount);
router.post('/login', loginUser);

export default router;
