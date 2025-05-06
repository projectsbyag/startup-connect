const express = require('express');
const router = express.Router();
const startupController = require('../controllers/startupController.js');
const { protect, authorize } = require('../middleware/auth.js');

// Public routes
router.get('/', startupController.getStartups);
router.get('/:id', startupController.getStartup);

// Protected routes
router.get('/user/:userId', protect, startupController.getStartupByUserId);
router.post('/', protect, authorize('startup'), startupController.createStartup);
router.put('/:id', protect, startupController.updateStartup);
router.delete('/:id', protect, startupController.deleteStartup);

// Documents
router.post('/documents', protect, authorize('startup'), startupController.uploadDocument);

// Matches
router.get('/:id/matches', protect, startupController.getStartupMatches);

module.exports = router;