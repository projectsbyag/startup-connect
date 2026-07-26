const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please add a startup name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    industry: {
        type: String,
        required: [true, 'Please select an industry'],
        enum: [
            'Fintech',
            'Healthcare',
            'Education',
            'Agriculture',
            'Software',
            'E-commerce',
            'Clean Energy',
            'Logistics',
            'Food & Beverage',
            'Other'
        ]
    },
    revenueHistory: [
    {
        date: { type: String, required: true }, // e.g., '2024-01'
        amount: { type: Number, required: true }
    }
],
    funding: {
        type: String,
        required: [true, 'Please select a funding stage'],
        enum: ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+']
    },
    fundingAmount: {
        type: Number,
        default: 0
    },
    fundingGoal: {
        type: Number
    },
    founded: {
        type: String,
        required: [true, 'Please add founding year']
    },
    location: {
        type: String,
        required: [true, 'Please add location']
    },
    employees: {
        type: Number,
        required: [true, 'Please add number of employees'],
        default: 1
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    logo: {
        type: String
    },
    pitch: {
        type: String,
        maxlength: [2000, 'Pitch cannot be more than 2000 characters']
    },
    team: [
        {
            name: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            bio: {
                type: String
            },
            photo: {
                type: String
            },
            linkedin: {
                type: String
            }
        }
    ],
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
    socialMedia: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String
    },
    metrics: {
        revenue: Number,
        users: Number,
        growth: Number,
        runway: Number
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

// Indexes for performance
StartupSchema.index({ industry: 1, funding: 1 });
StartupSchema.index({ createdAt: -1 });

// Update the "updatedAt" field on save
StartupSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Startup', StartupSchema);