const Investor = require('../models/Investor.js');
const User = require('../models/User.js');

// @desc    Get all investors
// @route   GET /api/investors
// @access  Public
exports.getInvestors = async (req, res, next) => {
    try {
        // Build query
        let query = { isActive: true };
        
        // Filter by investment focus
        if (req.query.focus) {
            query.focus = req.query.focus;
        }
        
        // Filter by investment stage
        if (req.query.stage) {
            query.stage = req.query.stage;
        }
        
        // Filter by location
        if (req.query.location) {
            query.location = { $regex: req.query.location, $options: 'i' };
        }
        
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Investor.countDocuments(query);
        
        // Execute query
        const investors = await Investor.find(query)
            .skip(startIndex)
            .limit(limit)
            .sort({ portfolioSize: -1 });
        
        // Pagination result
        const pagination = {};
        
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }
        
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }
        
        res.status(200).json({
            success: true,
            count: investors.length,
            total,
            pagination,
            investors
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get single investor
// @route   GET /api/investors/:id
// @access  Public
exports.getInvestor = async (req, res, next) => {
    try {
        const investor = await Investor.findById(req.params.id);
        
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: investor
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get investor by user ID
// @route   GET /api/investors/user/:userId
// @access  Private
exports.getInvestorByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user.id;
        
        const investor = await Investor.findOne({ userId });
        
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor profile not found'
            });
        }
        
        res.status(200).json({
            success: true,
            investor
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Create new investor
// @route   POST /api/investors
// @access  Private
exports.createInvestor = async (req, res, next) => {
    try {
        // Check if user is an investor
        if (req.user.userType !== 'investor') {
            return res.status(403).json({
                success: false,
                message: 'Only investor accounts can create investor profiles'
            });
        }
        
        // Check if user already has an investor profile
        const existingInvestor = await Investor.findOne({ userId: req.user.id });
        
        if (existingInvestor) {
            return res.status(400).json({
                success: false,
                message: 'User already has an investor profile'
            });
        }
        
        // Create investor profile
        req.body.userId = req.user.id;
        
        const investor = await Investor.create(req.body);
        
        res.status(201).json({
            success: true,
            data: investor
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Update investor
// @route   PUT /api/investors/:id
// @access  Private
exports.updateInvestor = async (req, res, next) => {
    try {
        let investor = await Investor.findById(req.params.id);
        
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor not found'
            });
        }
        
        // Make sure user owns the investor profile
        if (investor.userId.toString() !== req.user.id && req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this investor profile'
            });
        }
        
        // Update investor
        investor = await Investor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            data: investor
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Delete investor
// @route   DELETE /api/investors/:id
// @access  Private
exports.deleteInvestor = async (req, res, next) => {
    try {
        const investor = await Investor.findById(req.params.id);
        
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor not found'
            });
        }
        
        // Make sure user owns the investor profile
        if (investor.userId.toString() !== req.user.id && req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this investor profile'
            });
        }
        
        await investor.remove();
        
        res.status(200).json({
            success: true,
            message: 'Investor profile deleted'
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get investor suggested matches
// @route   GET /api/investors/:id/matches
// @access  Private
exports.getInvestorMatches = async (req, res, next) => {
    try {
        const investor = await Investor.findById(req.params.id);
        
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor not found'
            });
        }
        
        // Make sure user owns the investor profile or is a startup
        if (investor.userId.toString() !== req.user.id && req.user.userType !== 'startup') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these matches'
            });
        }
        
        // Find matching startups based on industry and funding stage
        const matchingStartups = await Startup.find({
            industry: { $in: investor.focus },
            funding: { $in: investor.stage },
            isActive: true
        }).limit(5);
        
        res.status(200).json({
            success: true,
            count: matchingStartups.length,
            data: matchingStartups
        });
        
    } catch (error) {
        next(error);
    }
};