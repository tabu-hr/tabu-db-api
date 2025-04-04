const express = require('express');
const router = express.Router();
const { revokeToken, refreshToken } = require('../../services/jwt');
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

// Route to refresh the JWT token
router.post('/refresh-token', (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    const { newAccessToken, newRefreshToken } = refreshToken(token);
    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
