const Startup = require('../models/Startup.js');
const User = require('../models/User.js');
const Investor = require('../models/Investor.js');
const Message = require('../models/Message.js');
const Conversation = require('../models/Conversation.js');
const Connection = require('../models/Connection.js');
// @desc    Get all startups
// @route   GET /api/startups
// @access  Public
exports.getStartups = async (req, res, next) => {
    try {
        // Build query
        let query = { isActive: true };
        
        // Filter by industry
        if (req.query.industry) {
            query.industry = req.query.industry;
        }
        
        // Filter by funding stage
        if (req.query.funding) {
            query.funding = req.query.funding;
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
        const total = await Startup.countDocuments(query);
        
        // Execute query
        const startups = await Startup.find(query)
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 });
        
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
            count: startups.length,
            total,
            pagination,
            startups
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get single startup
// @route   GET /api/startups/:id
// @access  Public

exports.getStartup = async (req, res, next) => {
    try {
        const startup = await Startup.findById(req.params.startupId);
        
        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup not found'
            });
        }
        
        // Changed to match frontend expectation of 'startup' property
        res.status(200).json({
            success: true,
            startup: startup  // Changed from 'data' to 'startup'
        });
        
    } catch (error) {
        // Add better error handling
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid startup ID format'
            });
        }
        next(error);
    }
};
// @desc    Get startup by user ID
// @route   GET /api/startups/user/:userId
// @access  Private
exports.getStartupByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user.id;
        const startup = await Startup.findOne({ userId });

        if (!startup) {
            // No startup profile yet, return minimal response
            return res.status(200).json({
                success: true,
                startup: null
            });
        }

        // --- Stats calculation ---
        const profileViews = startup.views || 0;
        const connections = await Connection.countDocuments({
            status: 'accepted',
            $or: [
                { requester: startup.userId },
                { recipient: startup.userId }
            ]
        });
        const conversations = await Conversation.find({ participants: userId });
        const conversationIds = conversations.map(c => c._id);
        const messages = await Message.countDocuments({ conversation: { $in: conversationIds } });
        const matchScore = startup.matchScore || '-';

        res.status(200).json({
            success: true,
            startup: {
                ...startup.toObject(),
                stats: {
                    profileViews,
                    connections,
                    messages,
                    matchScore
                },
                revenueHistory: startup.revenueHistory || []
            }
        });
    } catch (error) {
        next(error);
    }
};
// @desc    Create new startup
// @route   POST /api/startups
// @access  Private

exports.getCurrentStartup = async (req, res, next) => {
    try {
        const startup = await Startup.findOne({ userId: req.user.id });
        
        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'No startup profile found'
            });
        }

        res.status(200).json({
            success: true,
            startup: startup
        });
    } catch (error) {
        next(error);
    }
};


exports.createStartup = async (req, res, next) => {
    try {
        // Check if user already has a startup profile
        const existingStartup = await Startup.findOne({ userId: req.user.id });
        
        if (existingStartup) {
            return res.status(400).json({
                success: false,
                message: 'User already has a startup profile'
            });
        }

        // Create startup profile
        const startup = await Startup.create({
            userId: req.user.id,
            name: req.body.name,
            description: req.body.description,
            industry: req.body.industry,
            funding: req.body.funding,
            fundingAmount: req.body.fundingAmount || 0,
            employees: req.body.employees || 1,
            founded: req.body.founded,
            location: req.body.location,
            pitch: req.body.pitch
        });

        res.status(201).json({
            success: true,
            startup: startup
        });

    } catch (error) {
        // Log the actual error for debugging
        console.error('Startup creation error:', error);
        
        // Send appropriate error response
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        
        next(error);
    }
};
// @desc    Update startup
// @route   PUT /api/startups/:id
// @access  Private
exports.updateStartup = async (req, res, next) => {
    try {
        const startupId = req.params.startupId;
        let startup = await Startup.findById(startupId);

        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup not found'
            });
        }

        // Make sure user owns the startup profile
        if (startup.userId.toString() !== req.user.id && req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this startup profile'
            });
        }

        // Handle funding amount history
        if (req.body.fundingAmount !== undefined && 
            req.body.fundingAmount !== startup.fundingAmount) {
            const now = new Date();
            const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            if (!startup.revenueHistory) startup.revenueHistory = [];
            startup.revenueHistory.push({
                date: dateStr,
                amount: req.body.fundingAmount
            });
        }

        // Update startup with new data
        startup = await Startup.findByIdAndUpdate(
            startupId,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            startup: startup
        });

    } catch (error) {
        next(error);
    }
};// @desc    Delete startup
// @route   DELETE /api/startups/:id
// @access  Private
exports.deleteStartup = async (req, res, next) => {
    try {
        const startup = await Startup.findById(req.params.id);
        
        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup not found'
            });
        }
        
        // Make sure user owns the startup profile
        if (startup.userId.toString() !== req.user.id && req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this startup profile'
            });
        }
        
        await startup.remove();
        
        res.status(200).json({
            success: true,
            message: 'Startup profile deleted'
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Upload startup document
// @route   POST /api/startups/documents
// @access  Private
exports.uploadDocument = async (req, res, next) => {
    try {
        if (!req.files || !req.files.document) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }
        
        const file = req.files.document;
        
        // Make sure the file is a valid document
        if (!file.mimetype.match(/\/(pdf|msword|vnd.openxmlformats-officedocument|vnd.ms-excel)/)) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a valid document (PDF, Word, Excel, etc.)'
            });
        }
        
        // Check file size (limit to 10 MB)
        if (file.size > 10 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: 'File size should be less than 10 MB'
            });
        }
        
        // Find startup
        const startup = await Startup.findOne({ userId: req.user.id });
        
        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup profile not found'
            });
        }
        
        // Create custom filename
        const fileName = `startup_${startup._id}_${Date.now()}${path.parse(file.name).ext}`;
        
        // Upload file to S3 (in a real app)
        // For now, we'll assume the file is uploaded and return a dummy URL
        const fileUrl = `https://startupconnect-files.s3.amazonaws.com/${fileName}`;
        
        // Add document to startup profile
        startup.documents.push({
            name: req.body.name || file.name,
            fileUrl,
            fileType: file.mimetype
        });
        
        await startup.save();
        
        res.status(200).json({
            success: true,
            data: startup.documents[startup.documents.length - 1]
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get startup suggested matches
// @route   GET /api/startups/:id/matches
// @access  Private
exports.getStartupMatches = async (req, res, next) => {
    try {
        const startup = await Startup.findById(req.params.id);
        
        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup not found'
            });
        }
        
        // Make sure user owns the startup or is an investor
        if (startup.userId.toString() !== req.user.id && req.user.userType !== 'investor') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these matches'
            });
        }
        
        // Find matching investors based on industry and funding stage
        const matchingInvestors = await Investor.find({
            focus: startup.industry,
            stage: startup.funding,
            isActive: true
        }).limit(5);
        
        res.status(200).json({
            success: true,
            count: matchingInvestors.length,
            data: matchingInvestors
        });
        
    } catch (error) {
        next(error);
    }
};
exports.getInvestorMatches = async (req, res, next) => {
    try {
        const startup = await Startup.findById(req.params.id).populate('userId', 'name email');

        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup not found'
            });
        }

        // Fetch all investors to score match percentage
        const investors = await Investor.find({})
            .populate('userId', 'name email')
            .select('firm position focus stage min max location bio portfolioSize website');

        // Score each investor against the startup's profile
        const matches = investors.map(investor => {
            let score = 65; // Base baseline score
            let matchDetails = [];

            // Industry match (+20%)
            if (investor.focus && (investor.focus.includes(startup.industry) || investor.focus.includes('Other'))) {
                score += 20;
                matchDetails.push({ type: 'Industry Match', score: 20, detail: startup.industry });
            }

            // Stage match (+10%)
            if (investor.stage && (investor.stage.includes(startup.funding) || investor.stage.includes('Seed'))) {
                score += 10;
                matchDetails.push({ type: 'Stage Match', score: 10, detail: startup.funding });
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
                matchPercentage: Math.min(Math.round(score), 98),
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
exports.getStartupDocuments = async (req, res, next) => {
    try {
        const startup = await Startup.findOne({ userId: req.user.id });
        
        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup profile not found'
            });
        }
        
        res.status(200).json({
            success: true,
            documents: startup.documents
        });
        
    } catch (error) {
        next(error);
    }
};
exports.getStartupAnalytics = async (req, res, next) => {
    try {
        const startup = await Startup.findOne({ userId: req.user.id });

        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup profile not found'
            });
        }

        // Get number of accepted connections
        const connections = await Connection.countDocuments({ startup: startup._id, status: 'accepted' });

        // Get number of views (assuming views are tracked in the Startup model)
        const views = startup.views || 0;

        // Get metrics from the startup document
        const metrics = startup.metrics || {};

        // Calculate growth rate (if possible)
        let growthRate = null;
        if (typeof metrics.growth === 'number' && typeof metrics.users === 'number' && metrics.users > 0) {
            growthRate = metrics.growth;
        }

        // Calculate runway in months (if possible)
        let runwayMonths = null;
        if (typeof metrics.runway === 'number' && metrics.runway > 0) {
            runwayMonths = metrics.runway;
        }

        res.status(200).json({
            success: true,
            data: {
                connections,
                views,
                revenue: metrics.revenue || 0,
                users: metrics.users || 0,
                growth: growthRate,
                runway: runwayMonths
            }
        });

    } catch (error) {
        next(error);
    }
};


exports.saveStartup = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Check if the startup exists
        const startup = await Startup.findById(req.body.startupId);
        if (!startup) return res.status(404).json({ success: false, message: 'Startup profile not found' });

        if (!user.savedStartups) user.savedStartups = [];
        if (!user.savedStartups.includes(req.body.startupId)) {
            user.savedStartups.push(req.body.startupId);
            await user.save();
        }

        res.json({ success: true, message: 'Startup saved' });
    } catch (error) {
        next(error);
    }
};
exports.removeSavedStartup = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (!user.savedStartups) user.savedStartups = [];
        user.savedStartups = user.savedStartups.filter(id => id.toString() !== req.body.startupId);
        await user.save();
        res.json({ success: true, message: 'Investor removed from saved' });
    } catch (error) { next(error); }
};