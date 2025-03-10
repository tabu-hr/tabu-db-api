const express = require('express');
const router = express.Router();
const { NotFoundError } = require('../../errors/customErrors');
const { validateListCountrySalary } = require('../../validators');
const { responseListCountrySalaryData } = require('../../dto/list_country_salary');
const { queryListCountrySalaryByUniqueId } = require('../../models/list_country_salary');

/**
 * @swagger
 * /api/list_country_salary/check:
 *   post:
 *     summary: Check country salary data
 *     description: Retrieves country salary information for the given unique ID
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
 *                 description: Unique identifier for the country salary data
 *     responses:
 *       200:
 *         description: Country salary data
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
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           country:
 *                             type: string
 *                           salary:
 *                             type: number
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
 *         description: Country salary data not found
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
router.post('/check', validateListCountrySalary, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const rows = await queryListCountrySalaryByUniqueId(unique_id);
    if (rows.length > 0) {
      res.json(responseListCountrySalaryData(true, 'List country salary data exists', true, 'queryListCountrySalaryByUniqueId', null, rows));
    } else {
      throw new NotFoundError('List country salary data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

