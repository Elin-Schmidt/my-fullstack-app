import express from 'express';
import { createAccount } from '../controllers/createAccountController';
import { loginUser } from '../controllers/loginUserController';

const router = express.Router();

router.post('/register', createAccount);
router.post('/login', loginUser);

export default router;
