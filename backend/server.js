require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const errorHandler = require('./middleware/errorHandler.js');

// Load environment variables
dotenv.config();

// Connect to database
// Connect to database
connectDB();


// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable Morgan logging in development
if (process.env.NODE_ENV !== 'production') {
    app.use(require('morgan')('dev'));
}

// API Routes
app.use('/api/users', require('./routes/users.js'));
app.use('/api/startups', require('./routes/startups.js'));
app.use('/api/investors', require('./routes/investors.js'));
app.use('/api/messages', require('./routes/messages.js'));
app.use('/api/connections', require('./routes/connections.js'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'));
    });
}

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});