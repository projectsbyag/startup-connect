const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config.js');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    userType: {
        type: String,
        enum: ['startup', 'investor', 'admin'],
        required: [true, 'Please specify user type']
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number cannot be longer than 20 characters']
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    savedInvestors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investor' }],
savedStartups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Startup' }],
    twoFactorSecret: {
        type: String,
        select: false
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id },
        config.jwtSecret,
        { expiresIn: config.jwtExpire }
    );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return resetToken;
};

// Generate email verification token
UserSchema.methods.getVerificationToken = function() {
    // Generate token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set to verificationToken field
    this.verificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    
    // Set expire
    this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    return verificationToken;
};

module.exports = mongoose.model('User', UserSchema);