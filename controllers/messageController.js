const Message = require('../models/Message.js');
const Conversation = require('../models/Conversation.js');
const User = require('../models/User.js');

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
    try {
        // Find all conversations where the current user is a participant
        const conversations = await Conversation.find({
            participants: req.user.id,
            isActive: true
        })
            .populate({
                path: 'participants',
                select: 'name email userType'
            })
            .populate({
                path: 'lastMessage',
                select: 'content createdAt isRead'
            })
            .sort({ updatedAt: -1 });
        
        // Format the conversations to include unread count for the current user
        const formattedConversations = conversations.map(conversation => {
            const otherParticipants = conversation.participants.filter(
                participant => participant._id.toString() !== req.user.id
            );
            
            return {
                _id: conversation._id,
                participants: otherParticipants,
                lastMessage: conversation.lastMessage,
                unreadCount: conversation.unreadCount.get(req.user.id.toString()) || 0,
                updatedAt: conversation.updatedAt
            };
        });
        
        res.status(200).json({
            success: true,
            count: formattedConversations.length,
            data: formattedConversations
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/conversations/:id
// @access  Private
exports.getMessages = async (req, res, next) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }
        
        // Check if user is a participant in the conversation
        if (!conversation.participants.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this conversation'
            });
        }
        
        // Get messages
        const messages = await Message.find({
            conversation: req.params.id
        })
            .sort({ createdAt: 1 })
            .populate({
                path: 'sender',
                select: 'name userType'
            });
        
        // Mark messages as read
        await Message.updateMany(
            {
                conversation: req.params.id,
                receiver: req.user.id,
                isRead: false
            },
            {
                isRead: true,
                readAt: Date.now()
            }
        );
        
        // Reset unread count for this user in the conversation
        conversation.unreadCount.set(req.user.id.toString(), 0);
        await conversation.save();
        
        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new message
// @route   POST /api/messages
// @access  Private
exports.createMessage = async (req, res, next) => {
    try {
        const { conversation, receiver, content } = req.body;
        
        // Validate required fields
        if (!conversation || !receiver || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide conversation ID, receiver ID, and message content'
            });
        }
        
        // Check if conversation exists and user is a participant
        const existingConversation = await Conversation.findById(conversation);
        
        if (!existingConversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }
        
        if (!existingConversation.participants.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send messages in this conversation'
            });
        }
        
        // Check if receiver is a participant in the conversation
        if (!existingConversation.participants.includes(receiver)) {
            return res.status(400).json({
                success: false,
                message: 'Receiver is not a participant in this conversation'
            });
        }
        
        // Create message
        const message = await Message.create({
            conversation,
            sender: req.user.id,
            receiver,
            content
        });
        
        // Update conversation with last message and increment unread count
        existingConversation.lastMessage = message._id;
        existingConversation.updatedAt = Date.now();
        
        // Increment unread count for receiver
        const currentCount = existingConversation.unreadCount.get(receiver.toString()) || 0;
        existingConversation.unreadCount.set(receiver.toString(), currentCount + 1);
        
        await existingConversation.save();
        
        await message.populate({
            path: 'sender',
            select: 'name userType'
        });
        
        res.status(201).json({
            success: true,
            data: message
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Start a new conversation
// @route   POST /api/messages/conversations
// @access  Private
exports.startConversation = async (req, res, next) => {
    try {
        const { recipient, message } = req.body;
        
        // Validate required fields
        if (!recipient || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide recipient ID and initial message'
            });
        }
        
        // Check if recipient exists
        const recipientUser = await User.findById(recipient);
        
        if (!recipientUser) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found'
            });
        }
        
        // Check if a conversation already exists between these users
        const existingConversation = await Conversation.findOne({
            participants: { $all: [req.user.id, recipient] },
            isActive: true
        });
        
        if (existingConversation) {
            // Conversation exists, just send a new message
            const newMessage = await Message.create({
                conversation: existingConversation._id,
                sender: req.user.id,
                receiver: recipient,
                content: message
            });
            
            // Update conversation
            existingConversation.lastMessage = newMessage._id;
            existingConversation.updatedAt = Date.now();
            
            // Increment unread count for recipient
            const currentCount = existingConversation.unreadCount.get(recipient.toString()) || 0;
            existingConversation.unreadCount.set(recipient.toString(), currentCount + 1);
            
            await existingConversation.save();
            
            // Return the existing conversation with the new message
            await newMessage.populate({
                path: 'sender',
                select: 'name userType'
            });
            
            return res.status(200).json({
                success: true,
                conversation: existingConversation,
                message: newMessage
            });
        }
        
        // Create a new conversation
        const newConversation = await Conversation.create({
            participants: [req.user.id, recipient]
        });
        
        // Create the first message
        const newMessage = await Message.create({
            conversation: newConversation._id,
            sender: req.user.id,
            receiver: recipient,
            content: message
        });
        
        // Update conversation with first message
        newConversation.lastMessage = newMessage._id;
        
        // Set unread count for recipient
        newConversation.unreadCount.set(recipient.toString(), 1);
        
        await newConversation.save();
        
        // Populate participants and message data
        await newConversation.populate({
            path: 'participants',
            select: 'name email userType'
        });
        
        await newMessage.populate({
            path: 'sender',
            select: 'name userType'
        });
        
        res.status(201).json({
            success: true,
            conversation: newConversation,
            message: newMessage
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Archive a conversation
// @route   PUT /api/messages/conversations/:id/archive
// @access  Private
exports.archiveConversation = async (req, res, next) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }
        
        // Check if user is a participant
        if (!conversation.participants.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to archive this conversation'
            });
        }
        
        // Archive the conversation
        conversation.isActive = false;
        await conversation.save();
        
        res.status(200).json({
            success: true,
            message: 'Conversation archived successfully'
        });
        
    } catch (error) {
        next(error);
    }
};