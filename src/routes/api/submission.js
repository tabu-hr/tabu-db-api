const express = require('express');
const router = express.Router();
const { NotFoundError } = require('../../errors/customErrors');
const { querySubmissionByUniqueId } = require('../../models/submission');
const { responseSubmissionData } = require('../../dto/submission');
const { validateSubmission } = require('../../validators');
const { extractToken, authenticateToken } = require('../../middleware/auth');
const { verifyToken } = require('../../services/jwt');

router.post('/check', extractToken, authenticateToken, async (req, res, next) => {
  try {
    const { unique_id } = req.body;
    const row = await querySubmissionByUniqueId(unique_id);
    if (row) {
      res.json(responseSubmissionData(true, 'Submission data exists', true, 'querySubmissionByUniqueId', null, row));
    } else {
      throw new NotFoundError('Submission data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
