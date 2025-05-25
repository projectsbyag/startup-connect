const express = require('express');
const router = express.Router();
const startupController = require('../controllers/startupController.js');
const { protect, authorize } = require('../middleware/auth.js');

// Protected user-specific routes (these must come BEFORE generic routes)
router.get('/user/current', protect, startupController.getCurrentStartup);
router.get('/user/documents', protect, startupController.getStartupDocuments);
router.get('/user/analytics', protect, startupController.getStartupAnalytics);
router.get('/user/:startupId', protect, startupController.getStartupByUserId);

// Document routes
router.post('/documents', protect, authorize('startup'), startupController.uploadDocument);

// Save/Remove startup routes
router.post('/save-startup', protect, startupController.saveStartup);
router.post('/remove-saved-startup', protect, startupController.removeSavedStartup);

// Matches route
router.get('/:id/matches', protect, startupController.getInvestorMatches);

// CRUD operations
router.post('/create', protect, startupController.createStartup);
router.put('/:startupId', protect, startupController.updateStartup);
router.delete('/:id', protect, startupController.deleteStartup);

// Public routes (these must come LAST)
router.get('/', startupController.getStartups);
router.get('/:startupId', startupController.getStartup);

module.exports = router;