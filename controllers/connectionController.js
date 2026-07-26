const Connection = require('../models/Connection.js');
const User = require('../models/User.js');

// @desc    Send a connection request
// @route   POST /api/connections/request
// @access  Private
exports.sendConnectionRequest = async (req, res, next) => {
    try {
        let recipientId = req.body.recipient || req.body.recipientId || req.body.investorId || req.body.startupId;

        if (!recipientId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid recipient ID'
            });
        }

        // If recipientId belongs to an Investor or Startup profile, resolve to underlying User ID
        const InvestorModel = require('../models/Investor.js');
        const StartupModel = require('../models/Startup.js');

        const investor = await InvestorModel.findById(recipientId);
        if (investor && investor.userId) {
            recipientId = investor.userId;
        } else {
            const startup = await StartupModel.findById(recipientId);
            if (startup && startup.userId) {
                recipientId = startup.userId;
            }
        }

        const recipientUser = await User.findById(recipientId);
        
        if (!recipientUser) {
            return res.status(404).json({
                success: false,
                message: 'Recipient user not found'
            });
        }
        
        // Check if connection already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { requester: req.user.id, recipient: recipientId },
                { requester: recipientId, recipient: req.user.id }
            ]
        });
        
        if (existingConnection) {
            return res.status(400).json({
                success: false,
                message: 'Connection request already exists or users are already connected'
            });
        }
        
        // Create connection request
        const connection = await Connection.create({
            requester: req.user.id,
            recipient: recipientId,
            message: req.body.message || ''
        });
        
        res.status(201).json({
            success: true,
            data: connection
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get all connection requests
// @route   GET /api/connections/requests
// @access  Private
exports.getConnectionRequests = async (req, res, next) => {
    try {
        // Find connection requests where the current user is the recipient
        const requests = await Connection.find({
            recipient: req.user.id,
            status: 'pending'
        })
            .populate({
                path: 'requester',
                select: 'name email userType'
            })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get sent connection requests
// @route   GET /api/connections/requests/sent
// @access  Private
exports.getSentRequests = async (req, res, next) => {
    try {
        // Find connection requests where the current user is the requester
        const requests = await Connection.find({
            requester: req.user.id,
            status: 'pending'
        })
            .populate({
                path: 'recipient',
                select: 'name email userType'
            })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Accept a connection request
// @route   PUT /api/connections/:id/accept
// @access  Private
exports.acceptConnection = async (req, res, next) => {
    try {
        const connection = await Connection.findById(req.params.id);
        
        if (!connection) {
            return res.status(404).json({
                success: false,
                message: 'Connection request not found'
            });
        }
        
        // Check if user is the recipient of the request
        if (connection.recipient.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to accept this connection request'
            });
        }
        
        // Check if request is pending
        if (connection.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'This connection request has already been processed'
            });
        }
        
        // Update connection status
        connection.status = 'accepted';
        connection.updatedAt = Date.now();
        await connection.save();
        
        res.status(200).json({
            success: true,
            data: connection
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Reject a connection request
// @route   PUT /api/connections/:id/reject
// @access  Private
exports.rejectConnection = async (req, res, next) => {
    try {
        const connection = await Connection.findById(req.params.id);
        
        if (!connection) {
            return res.status(404).json({
                success: false,
                message: 'Connection request not found'
            });
        }
        
        // Check if user is the recipient of the request
        if (connection.recipient.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to reject this connection request'
            });
        }
        
        // Check if request is pending
        if (connection.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'This connection request has already been processed'
            });
        }
        
        // Update connection status
        connection.status = 'rejected';
        connection.updatedAt = Date.now();
        await connection.save();
        
        res.status(200).json({
            success: true,
            data: connection
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get all connections
// @route   GET /api/connections
// @access  Private
exports.getConnections = async (req, res, next) => {
    try {
        // Find all accepted connections where the user is either requester or recipient
        const connections = await Connection.find({
            $or: [
                { requester: req.user.id },
                { recipient: req.user.id }
            ],
            status: 'accepted'
        })
            .populate({
                path: 'requester',
                select: 'name email userType'
            })
            .populate({
                path: 'recipient',
                select: 'name email userType'
            })
            .sort({ updatedAt: -1 });
        
        // Format the connections to include the connected user (not the current user)
        const formattedConnections = connections.map(connection => {
            const isRequester = connection.requester._id.toString() === req.user.id;
            const connectedUser = isRequester ? connection.recipient : connection.requester;
            
            return {
                _id: connection._id,
                user: {
                    _id: connectedUser._id,
                    name: connectedUser.name,
                    userType: connectedUser.userType
                },
                createdAt: connection.createdAt,
                updatedAt: connection.updatedAt
            };
        });
        
        res.status(200).json({
            success: true,
            count: formattedConnections.length,
            data: formattedConnections
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get connection status with a specific user
// @route   GET /api/connections/status/:userId
// @access  Private
exports.getConnectionStatus = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        
        // Check if user exists
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Find connection between users
        const connection = await Connection.findOne({
            $or: [
                { requester: req.user.id, recipient: userId },
                { requester: userId, recipient: req.user.id }
            ]
        });
        
        if (!connection) {
            return res.status(200).json({
                success: true,
                status: 'none'
            });
        }
        
        // Determine relationship status
        let status = connection.status;
        
        // If pending, determine if the current user is the requester or recipient
        if (status === 'pending') {
            status = connection.requester.toString() === req.user.id ? 'sent' : 'received';
        }
        
        res.status(200).json({
            success: true,
            status,
            connectionId: connection._id
        });
        
    } catch (error) {
        next(error);
    }
};