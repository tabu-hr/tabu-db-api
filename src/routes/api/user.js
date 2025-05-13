const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const { queryUserTable, queryUserByEmail } = require('../../models/user');
const { responseUser, responseCheckUser } = require('../../dto/user');
const { validateUserCheck } = require('../../validators');
const { verifyGoogleToken, generateTokens } = require('../../services/jwt');
router.get('/', async (req, res, next) => {
  try {
    const rows = await queryUserTable();
    res.json(responseUser(true, 'user', 'queryUserTable', rows));
  } catch (err) {
    next(err);
  }
});

router.post('/check', async (req, res, next) => {
  const { email, isGoogleLogin, name, credential } = req.body;
  try {
    if (!isGoogleLogin) {
      return res.status(400).json(responseCheckUser(
        false,
        'Only Google login is supported',
        false,
        'checkLogin',
        'Google login is required',
        null,
        null,
        null
      ));
    }

    if (!credential) {
      throw new Error('Google credential is required for Google login');
    }

    let googleUserId;
    try {
      const payload = await verifyGoogleToken(credential);
      googleUserId = payload.sub;
    } catch (error) {
      return res.status(401).json(responseCheckUser(
        false,
        'Invalid Google credentials',
        false,
        'verifyGoogleToken',
        error.message,
        null,
        null,
        null
      ));
    }

    const row = await queryUserByEmail(email);
    if (row) {
      const tokens = generateTokens(googleUserId);
      res.json(responseCheckUser(
        true,
        'User email exists',
        true,
        'queryUserByEmail',
        null,
        name,
        row.unique_id,
        row.needs_to_update,
        tokens
      ));
    } else {
      res.json(responseCheckUser(
        true,
        'User email does not exist',
        false,
        'queryUserByEmail',
        null,
        null,
        null,
        null
      ));
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
