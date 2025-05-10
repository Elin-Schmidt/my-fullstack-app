const express = require('express');
import { Router } from 'express';

const createAccountController = require('../controllers/createAccount');
const loginController = require('../controllers/login');
const router = Router();

// Skapa konto
router.post('/create-account', createAccountController.createAccount);

// Logga in
router.post('/login', loginController.loginUser);

export default router;
