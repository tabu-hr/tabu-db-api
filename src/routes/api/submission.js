const express = require('express');
const router = express.Router();
const { NotFoundError } = require('../../errors/customErrors');
const { querySubmissionByUniqueId } = require('../../models/submission');
const { responseSubmissionData } = require('../../dto/submission');
const { validateSubmission } = require('../../validators');

router.post('/check', async (req, res, next) => {
  const { unique_id } = req.body;
  try {
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
