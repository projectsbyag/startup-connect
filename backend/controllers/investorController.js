const Investor = require('../models/Investor.js');
const Startup = require('../models/Startup.js');
const Connection = require('../models/Connection.js');
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
        const investor = await Investor.findById(req.params.investorId);
        
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor not found'
            });
        }
        
        res.status(200).json({
            success: true,
            investor: investor // Changed from 'data' to 'investor'
        });
        
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid investor ID format'
            });
        }
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
// @desc    Get investor suggested matches
// @route   GET /api/investors/:id/matches
// @access  Private
exports.getInvestorMatches = async (req, res, next) => {
    try {
        const startup = await Startup.findById(req.params.id)
            .populate('userId', 'name email');

        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup not found'
            });
        }

        // Find matching investors based on startup criteria
        const matchingInvestors = await Investor.find({
            // Match industry focus with startup's industry
            focus: { $in: [startup.industry] },
            
            // Match funding stage
            stage: { $in: [startup.funding] },
            
            // Match funding amount within investor's range
            min: { $lte: startup.fundingGoal || 0 },
            max: { $gte: startup.fundingGoal || 0 },
            
            // Only active investors
            isActive: true,
            
            // Exclude already connected investors
            _id: { 
                $nin: await Connection.distinct('investor', { 
                    startup: startup._id,
                    status: { $in: ['accepted', 'pending'] }
                })
            }
        })
        .populate('userId', 'name email')
        .select('firm position focus stage min max location bio portfolioSize');

        // Calculate match percentage for each investor
        const matches = matchingInvestors.map(investor => {
            let score = 0;
            let matchDetails = [];
            
            // Industry match (40%)
            if (investor.focus.includes(startup.industry)) {
                score += 40;
                matchDetails.push({
                    type: 'Industry Match',
                    score: 40,
                    detail: startup.industry
                });
            }
            
            // Stage match (30%)
            if (investor.stage.includes(startup.funding)) {
                score += 30;
                matchDetails.push({
                    type: 'Stage Match',
                    score: 30,
                    detail: startup.funding
                });
            }
            
            // Funding match (30%)
            if (startup.fundingGoal >= investor.min && startup.fundingGoal <= investor.max) {
                score += 30;
                matchDetails.push({
                    type: 'Investment Range',
                    score: 30,
                    detail: `$${investor.min.toLocaleString()} - $${investor.max.toLocaleString()}`
                });
            }

            return {
                investor: {
                    _id: investor._id,
                    name: investor.userId?.name || 'Anonymous Investor',
                    firm: investor.firm,
                    position: investor.position,
                    focus: investor.focus,
                    stage: investor.stage,
                    location: investor.location,
                    portfolioSize: investor.portfolioSize,
                    bio: investor.bio
                },
                matchPercentage: Math.round(score),
                matchDetails: matchDetails
            };
        });

        // Sort by match percentage
        matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
        
    } catch (error) {
        next(error);
    }
};
// @desc    Get investor documents
// @route   GET /api/investors/user/documents
// @access  Private
exports.getInvestorDocuments = async (req, res, next) => {
    try {
        const investor = await Investor.findOne({ userId: req.user.id });
        
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor profile not found'
            });
        }
        
        res.status(200).json({
            success: true,
            documents: investor.documents
        });
        
    } catch (error) {
        next(error);
    }
};
// @desc    Get investor portfolio
// @route   GET /api/investors/user/portfolio   
// @access  Private
exports.getInvestorPortfolio = async (req, res, next) => {
    try {
        const investor = await Investor.findOne({ userId: req.user.id });
        
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor profile not found'
            });
        }
        
        res.status(200).json({
            success: true,
            portfolio: investor.portfolio
        });
        
    } catch (error) {
        next(error);
    }
};
// @desc    Add startup to investor portfolio
// @route   POST /api/investors/user/portfolio
// @access  Private
exports.addToPortfolio = async (req, res, next) => {
    try {
        const investor = await Investor.findOne({ userId: req.user.id });

        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor profile not found'
            });
        }

        // Optional: Check for duplicate by name and year
        const exists = investor.portfolio.some(company =>
            company.name === req.body.name && company.year === req.body.year
        );
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Company already in portfolio'
            });
        }

        // Add full company object
        investor.portfolio.push(req.body);
        await investor.save();

        res.status(200).json({
            success: true,
            message: 'Company added to portfolio',
            portfolio: investor.portfolio
        });

    } catch (error) {
        next(error);
    }
};

exports.editPortfolioCompany = async (req, res, next) => {
    try {
        const investor = await Investor.findOne({ userId: req.user.id });
        if (!investor) {
            return res.status(404).json({ success: false, message: 'Investor profile not found' });
        }

        // Find company by _id (sent as req.params.companyId)
        const company = investor.portfolio.id(req.params.companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Portfolio company not found' });
        }

        // Update fields
        Object.assign(company, req.body);
        await investor.save();

        res.status(200).json({
            success: true,
            message: 'Portfolio company updated',
            company
        });
    } catch (error) {
        next(error);
    }
};
exports.getStartupOpportunities = async (req, res, next) => {
    try {
        const investor = await Investor.findOne({ userId: req.user.id });
        if (!investor) return res.status(404).json({ success: false, message: 'Investor profile not found' });

        // Find startups that match investor's focus, stage, and investment range
        const startups = await Startup.find({
            industry: { $in: investor.focus },
            funding: { $in: investor.stage },
            fundingGoal: { $gte: investor.min, $lte: investor.max },
            isActive: true
        });

        // Calculate a match score for each startup (industry, stage, funding)
        const scoredStartups = startups.map(startup => {
            let score = 0;
            if (investor.focus.includes(startup.industry)) score += 40;
            if (investor.stage.includes(startup.funding)) score += 30;
            if (startup.fundingGoal >= investor.min && startup.fundingGoal <= investor.max) score += 30;
            return {
                ...startup.toObject(),
                matchScore: Math.round(score / 10) // e.g. 0-10 scale
            };
        });

        // Sort by match score descending
        scoredStartups.sort((a, b) => b.matchScore - a.matchScore);

        res.json({ success: true, startups: scoredStartups });
    } catch (error) {
        next(error);
    }
};