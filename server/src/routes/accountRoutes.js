const express = require('express');
const router = express.Router();
const createAccountController = require('../controllers/createAccount');
const loginController = require('../controllers/login');

// Skapa konto
router.post('/create-account', createAccountController.createAccount);

// Logga in
router.post('/login', loginController.loginUser);

module.exports = router;
