const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const { protect } = require('../middleware/auth.js');

// Register and login routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/me', protect, authController.updateDetails);
router.put('/change-password', protect, authController.updatePassword);

// Password reset
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:resetToken', authController.resetPassword);

module.exports = router;