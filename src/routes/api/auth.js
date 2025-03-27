const express = require('express');
const router = express.Router();
const { revokeToken } = require('../../services/jwt');
const { extractToken, authenticateToken } = require('../../middleware/auth');

// Route to revoke the current token
router.post('/revoke', extractToken, authenticateToken, (req, res) => {
  try {
    revokeToken(req.token);
    res.json({
      success: true,
      message: 'Token successfully revoked'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

