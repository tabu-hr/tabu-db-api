const express = require('express');
const router = express.Router();
const { NotFoundError } = require('../../errors/customErrors');
const { querySubmissionByUniqueId } = require('../../models/submission');
const { responseSubmissionData } = require('../../dto/submission');
const { validateSubmission } = require('../../validators');

/**
 * @swagger
 * /api/submission/check:
 *   post:
 *     summary: Check if a submission exists
 *     description: Verifies if a submission with the given unique ID exists in the database
 *     tags: [Submissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_id
 *             properties:
 *               unique_id:
 *                 type: string
 *                 description: Unique identifier of the submission
 *     responses:
 *       200:
 *         description: Submission data
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
 *                     data:
 *                       type: object
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
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/check', validateSubmission, async (req, res, next) => {
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

