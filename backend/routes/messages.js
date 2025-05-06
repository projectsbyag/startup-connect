const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController.js');
const { protect } = require('../middleware/auth.js');

// All routes are protected
router.use(protect);

// Conversations
router.get('/conversations', messageController.getConversations);
router.post('/conversations', messageController.startConversation);
router.get('/conversations/:id', messageController.getMessages);
router.put('/conversations/:id/archive', messageController.archiveConversation);

// Messages
router.post('/', messageController.createMessage);

module.exports = router;