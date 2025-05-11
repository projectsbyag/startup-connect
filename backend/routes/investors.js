const express = require('express');
const router = express.Router();
const investorController = require('../controllers/investorController.js');
const { protect, authorize } = require('../middleware/auth.js');

// Public routes
router.get('/', investorController.getInvestors);
router.get('/:investorId', investorController.getInvestor);

// Protected routes
router.get('/user/documents', protect, investorController.getInvestorDocuments);

router.get('/user/portfolio', protect, investorController.getInvestorPortfolio);
router.post('/user/portfolio', protect, investorController.addToPortfolio);
router.put('/user/portfolio/:companyId', protect, investorController.editPortfolioCompany);

router.get('/user/startup-opportunities', protect, investorController.getStartupOpportunities);

router.get('/user/:userId', protect, investorController.getInvestorByUserId);
// Ensure that 'protect', 'authorize', and 'investorController.createInvestor' are all functions
router.post('/', protect, authorize('investor'), investorController.createInvestor);
router.put('/:id', protect, investorController.updateInvestor);
router.delete('/:id', protect, investorController.deleteInvestor);

// Matches
router.get('/:id/matches', protect, investorController.getInvestorMatches);

module.exports = router;