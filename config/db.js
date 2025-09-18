// config/db.js
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  // Azure stores connection strings with CUSTOMCONNSTR_ prefix
  const MONGO_URI = process.env.DATABASE_URI || 
                    process.env.MONGODB_URI || 
                    process.env.CUSTOMCONNSTR_DATABASE_URI;

  //Debug: Log what we're trying to connect to
  console.log('→ Environment DATABASE_URI exists:', !!process.env.DATABASE_URI);
  console.log('→ Environment CUSTOMCONNSTR_DATABASE_URI exists:', !!process.env.CUSTOMCONNSTR_DATABASE_URI);
  console.log('→ Mongo will connect to:', MONGO_URI ? MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'NOT FOUND');

  // Fallback error if no URI is found
  if (!MONGO_URI) {
    console.error('✖ No DATABASE_URI or MONGODB_URI found in environment variables');
    console.error('Available env vars:', Object.keys(process.env).filter(key => 
      key.includes('MONGO') || key.includes('DATABASE')
    ));
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Give it more time
      family: 4,                      // Force IPv4
      bufferCommands: false,          // Immediate errors
    });

    console.log(`✔ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✖ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;