// Vercel serverless function entry point
const app = require('../gadget-city-backend/server');

// Export the Express app for Vercel
module.exports = app;