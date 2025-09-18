const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const config = require('../config/config.js');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, userType } = req.body;
        
        // Validate user type
        if (!['startup', 'investor'].includes(userType)) {
            return res.status(400).json({
                success: false,
                message: 'User type must be either startup or investor'
            });
        }
        
        // Check if user already exists
        const userExists = await User.findOne({ email });
        
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }
        
        // Create user
        const user = await User.create({
            name,
            email,
            password,
            userType
        });
        
        // Generate verification token
        // This would typically be used to send a verification email
        // const verificationToken = user.getVerificationToken();
        // await user.save();
        
        // For development purposes, we'll auto-verify the user
        user.isVerified = true;
        await user.save();
        
        // Send token
        sendTokenResponse(user, 201, res);
        
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        
        // Check for user
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check if password matches
        const isMatch = await user.matchPassword(password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Update last login
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });
        
        // Send token
        sendTokenResponse(user, 200, res);
        
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   GET /api/users/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        // user is already available in req due to the protect middleware
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user details
// @route   PUT /api/users/me
// @access  Private
exports.updateDetails = async (req, res, next) => {
    try {
        // Only allow certain fields to be updated
        const fieldsToUpdate = {
            name: req.body.name,
            phone: req.body.phone,
            bio: req.body.bio
        };
        
        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => 
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        );
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/users/change-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Validate
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }
        
        // Get user with password
        const user = await User.findById(req.user.id).select('+password');
        
        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Set new password
        user.password = newPassword;
        await user.save();
        
        // Send token
        sendTokenResponse(user, 200, res);
        
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that email'
            });
        }
        
        // Get reset token
        const resetToken = user.getResetPasswordToken();
        
        // Save the updated user
        await user.save({ validateBeforeSave: false });
        
        // In a real application, you would send an email with the reset token
        // For development, we'll just return the token
        
        res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            data: {
                resetToken
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const { resetToken } = req.params;
        
        // Hash token
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        
        // Find user with the token and check if token is still valid
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        
        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save();
        
        // Send token
        sendTokenResponse(user, 200, res);
        
    } catch (error) {
        next(error);
    }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            phone: user.phone,
            bio: user.bio,
            isVerified: user.isVerified,
            twoFactorEnabled: user.twoFactorEnabled
        }
    });
};