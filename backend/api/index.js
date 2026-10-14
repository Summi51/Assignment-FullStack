require('dotenv').config();
const app = require('../src/app');
const connectDB = require('../src/config/db');

// Vercel serverless function entry point.
// Reuses the MongoDB connection across warm invocations instead of
// reconnecting on every request.
let connectionPromise = null;

module.exports = async (req, res) => {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }
  try {
    await connectionPromise;
  } catch (err) {
    connectionPromise = null;
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Database connection failed' }));
    return;
  }
  return app(req, res);
};
