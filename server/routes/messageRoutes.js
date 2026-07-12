const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markAsRead } = require('../controllers/messageController');

router.get('/messages', getMessages);
router.post('/messages', sendMessage);
router.put('/messages/:messageId/read', markAsRead);

module.exports = router;
