const express = require('express');
const router = express.Router();
const investorController = require('../controllers/investorController.js');
const { protect, authorize } = require('../middleware/auth.js');

// Public routes
router.get('/', investorController.getInvestors);
router.get('/:id', investorController.getInvestor);

// Protected routes
router.get('/user/:userId', protect, investorController.getInvestorByUserId);
router.post('/', protect, authorize('investor'), investorController.createInvestor);
router.put('/:id', protect, investorController.updateInvestor);
router.delete('/:id', protect, investorController.deleteInvestor);

// Matches
router.get('/:id/matches', protect, investorController.getInvestorMatches);

module.exports = router;