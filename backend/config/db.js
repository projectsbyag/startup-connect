// config/db.js
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  // 1) pick up the .env value, fall back to hard‑coded IPv4 URI
  const MONGO_URI = process.env.DATABASE_URI?.trim() || 'mongodb://127.0.0.1:27017/startup-connect';

  // 2) surface it immediately in your logs
  console.log('→ Mongo will connect to:', MONGO_URI);

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast if it can’t reach the server
      family: 4,                   // force IPv4 (avoid ::1 entirely)
      bufferCommands: false,       // immediate errors instead of silent buffering
    });

    console.log(`✔ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✖ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
