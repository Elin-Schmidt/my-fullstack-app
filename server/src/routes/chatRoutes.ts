'use strict';
import express from 'express';
const router = express.Router();
const chatController = require('../controllers/chat');
// Exempel-routes
router.get('/messages', chatController.getMessages);
router.post('/messages', chatController.sendMessage);

export default router;
