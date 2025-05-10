const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');

// Exempel-routes
router.get('/messages', chatController.getMessages);
router.post('/messages', chatController.sendMessage);

module.exports = router;
