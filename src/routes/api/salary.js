const express = require('express');
const apiLimiter = require('../../middleware/rateLimiter');
const router = express.Router();
const cors = require('../../middleware/cors');
const errorHandler = require('../../middleware/errorHandler');
const { NotFoundError } = require('../../errors/customErrors');
const securityHeaders = require('../../middleware/securityHeaders');
const bigQueryConnectionPool = require('../../middleware/bigQueryConnectionPool');
const { validateSalary } = require('../../validators');

// Import required models
const { querySalaryByUniqueId } = require('../../models/salary');

// Import required DTOs
const { responseSalaryData } = require('../../dto/salary');

// Apply middleware
router.use(cors);
router.use(apiLimiter);
router.use(securityHeaders);
router.use(bigQueryConnectionPool);

/**
 * @swagger
 * /api/salary/check:
 *   post:
 *     summary: Check salary data
 *     description: Retrieves salary information for the given unique ID
 *     tags: [Salary]
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
 *                 description: Unique identifier for the salary record
 *     responses:
 *       200:
 *         description: Salary data
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
 *                     salary_net:
 *                       type: number
 *                     salary_gross:
 *                       type: number
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
 *         description: Salary data not found
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
router.post('/check', validateSalary, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await querySalaryByUniqueId(unique_id);
    if (row) {
      res.json(responseSalaryData(true, 'Salary data exists', true, 'querySalaryByUniqueId', null, row.salary_net, row.salary_gross));
    } else {
      throw new NotFoundError('Salary data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

router.use(errorHandler);

module.exports = router;

