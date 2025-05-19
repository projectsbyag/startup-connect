const express = require('express');
const router = express.Router();
const startupController = require('../controllers/startupController.js');
const { protect, authorize } = require('../middleware/auth.js');

// Public routes
router.get('/', startupController.getStartups);
router.get('/:startupId', startupController.getStartup);

// Protected routes
router.get('/user/documents', protect, startupController.getStartupDocuments);
router.get('/user/analytics', protect, startupController.getStartupAnalytics);
router.get('/user/:userId', protect, startupController.getStartupByUserId);


router.post('/', protect, authorize('startup'), startupController.createStartup);
router.put('/:startupId', protect, startupController.updateStartup);
router.delete('/:id', protect, startupController.deleteStartup);

// Documents
router.post('/documents', protect, authorize('startup'), startupController.uploadDocument);
router.post('/save-startup', protect, startupController.saveStartup);
router.post('/remove-saved-startup', protect, startupController.removeSavedStartup);

// Matches
//router.get('/:id/matches', protect, startupController.getStartupMatches);
router.get('/:id/matches', protect, startupController.getInvestorMatches);
module.exports = router;