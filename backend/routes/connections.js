const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController.js');
const { protect } = require('../middleware/auth.js');

// All routes are protected
router.use(protect);

// Connection requests
router.post('/request', connectionController.sendConnectionRequest);
router.get('/requests', connectionController.getConnectionRequests);
router.get('/requests/sent', connectionController.getSentRequests);
router.put('/:id/accept', connectionController.acceptConnection);
router.put('/:id/reject', connectionController.rejectConnection);

// Connections
router.get('/', connectionController.getConnections);
router.get('/status/:userId', connectionController.getConnectionStatus);

module.exports = router;