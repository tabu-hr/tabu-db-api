const { verifyToken } = require('../services/jwt');

// Middleware to extract token from Authorization header
const extractToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing or invalid'
    });
  }
  req.token = authHeader.split(' ')[1];
  next();
};

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  try {
    const decoded = verifyToken(req.token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  extractToken,
  authenticateToken
};

