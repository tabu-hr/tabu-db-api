
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config/config');

// In-memory storage for revoked tokens (should be replaced with Redis/DB in production)
const revokedTokens = new Set();

const googleClient = new OAuth2Client(config.auth.googleClientId);

const verifyGoogleToken = async (token) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: config.auth.googleClientId
    });
    const payload = ticket.getPayload();
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime < payload.iat) {
      throw new Error('Token used before issued time');
    }
    if (currentTime > payload.exp) {
      revokeToken(token); // Revoke expired token
      throw new Error('Token has expired');
    }
    return payload;
  } catch (error) {
    throw new Error(error.message || 'Invalid Google token');
  }
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId }, 
    config.auth.jwtSecret, 
    { expiresIn: config.auth.tokenExpiry.access }
  );
  const refreshToken = jwt.sign(
    { userId }, 
    config.auth.jwtSecret, 
    { expiresIn: config.auth.tokenExpiry.refresh }
  );
  
  return {
    accessToken,
    refreshToken
  };
};

const verifyToken = (token) => {
  try {
    if (revokedTokens.has(token)) {
      throw new Error('Token has been revoked');
    }
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && currentTime > decoded.exp) {
      revokeToken(token); // Revoke expired token
      throw new Error('Token has expired');
    }
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      revokeToken(token); // Revoke expired token
    }
    throw new Error(error.message || 'Invalid token');
  }
};

const revokeToken = (token) => {
  try {
    // Verify the token is valid before revoking
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    revokedTokens.add(token);
    return true;
  } catch (error) {
    throw new Error('Invalid token for revocation');
  }
};

module.exports = {
  verifyGoogleToken,
  generateTokens,
  verifyToken,
  revokeToken
};
