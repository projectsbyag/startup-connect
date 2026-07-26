require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const errorHandler = require('./middleware/errorHandler.js');

// Load environment variables
dotenv.config();

const compression = require('compression');

// Initialize Express
const app = express();

// Enable Gzip/Brotli Compression
app.use(compression());

// Dynamic CORS Middleware for Vercel, Netlify, Render & Localhost
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, postman, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed = 
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('vercel.app') ||
      origin.includes('netlify.app') ||
      origin.includes('onrender.com') ||
      origin.includes('github.io');

    if (isAllowed) {
      callback(null, true);
    } else {
      // Reflect requesting origin to allow cross-domain API access
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable Morgan logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(require('morgan')('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

// API Routes
app.use('/api/users', require('./routes/users.js'));
app.use('/api/startups', require('./routes/startups.js'));
app.use('/api/investors', require('./routes/investors.js'));
app.use('/api/messages', require('./routes/messages.js'));
app.use('/api/connections', require('./routes/connections.js'));

/* Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'));
    });
}
*/
// Error handler middleware
app.use(errorHandler);

// Start server after connecting to DB
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();