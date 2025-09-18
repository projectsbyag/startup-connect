const mongoose = require('mongoose');

const PortfolioCompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    industry: String,
    description: String,
    investmentAmount: Number,
    stage: String,
    year: Number,
    website: String,
    pitchDeck: String
}, { _id: true, timestamps: true });

const InvestorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firm: {
        type: String
    },
    position: {
        type: String,
        required: [true, 'Please add your position/title']
    },
    bio: {
        type: String,
        required: [true, 'Please add a bio'],
        maxlength: [1000, 'Bio cannot be more than 1000 characters']
    },
    location: {
        type: String,
        required: [true, 'Please add location']
    },
    documents: [
        {
            name: {
                type: String,
                required: true
            },
            fileUrl: {
                type: String,
                required: true
            },
            fileType: {
                type: String,
                required: true
            },
            uploadDate: {
                type: Date,
                default: Date.now
            }
        }
    ],
    focus: {
        type: [String],
        required: [true, 'Please add at least one investment focus area'],
        enum: [
            'Fintech',
            'Healthcare',
            'Education',
            'Agriculture',
            'Software',
            'AI',
            'E-commerce',
            'Energy',
            'Other'
        ]
    },
    stage: {
        type: [String],
        required: [true, 'Please add at least one investment stage'],
        enum: ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth']
    },
    min: {
        type: Number,
        required: [true, 'Please add minimum investment amount'],
        default: 0
    },
    max: {
        type: Number,
        required: [true, 'Please add maximum investment amount'],
        default: 0
    },
    portfolioSize: {
        type: Number,
        default: 0
    },
    portfolio: [PortfolioCompanySchema],
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    photo: {
        type: String
    },
    socialMedia: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String
    },
    investmentCriteria: {
        type: String,
        maxlength: [1000, 'Investment criteria cannot be more than 1000 characters']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// Update the "updatedAt" field on save
InvestorSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Investor', InvestorSchema);