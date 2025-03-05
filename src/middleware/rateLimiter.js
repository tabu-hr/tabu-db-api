const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const apiLimiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.max,
  message: config.rateLimiting.message,
});

module.exports = apiLimiter;
