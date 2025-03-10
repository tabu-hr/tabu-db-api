const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../../middleware/cache');
const config = require('../../config/config');
const { queryUserTable, queryUserByEmail } = require('../../models/user');
const { responseUser, responseCheckUser } = require('../../dto/user');
const { validateUserCheck } = require('../../validators');

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users in the database
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', cacheMiddleware('user', config.cache.durations.USER), async (req, res, next) => {
  try {
    const rows = await queryUserTable();
    res.json(responseUser(true, 'user', 'queryUserTable', rows));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/user/check:
 *   post:
 *     summary: Check if a user exists by email
 *     description: Verifies if a user with the given email address exists in the database
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address to check
 *               isGoogleLogin:
 *                 type: boolean
 *                 description: Whether the login attempt is via Google authentication
 *               name:
 *                 type: string
 *                 description: User's name (required for Google login)
 *     responses:
 *       200:
 *         description: User check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exists:
 *                       type: boolean
 *                     name:
 *                       type: string
 *                       nullable: true
 *                     unique_id:
 *                       type: string
 *                       nullable: true
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/check', validateUserCheck, async (req, res, next) => {
  const { email, isGoogleLogin, name } = req.body;
  try {
    const row = await queryUserByEmail(email);
    if (row) {
      if (isGoogleLogin) {
        res.json(responseCheckUser(true, 'User email exists', true, 'queryUserByEmail', null, name, row.unique_id));
      } else {
        res.json(responseCheckUser(true, 'User email does not exist', false, 'queryUserByEmail'));
      }
    } else {
      res.json(responseCheckUser(true, 'User email does not exist', false, 'queryUserByEmail'));
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

