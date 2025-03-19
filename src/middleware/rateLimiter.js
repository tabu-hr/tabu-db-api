const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const apiLimiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.max,
  message: config.rateLimiting.message,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      statusCode: 429,
      type: 'TOO_MANY_REQUESTS',
      message: config.rateLimiting.message,
    });
  },
});

module.exports = apiLimiter;
