const express = require('express');
const router = express.Router();
const { NotFoundError } = require('../../errors/customErrors');
const { responseDataAmountData } = require('../../dto/data_amount');
const { queryDataAmountByUniqueId } = require('../../models/data_amount');
const { responseDataAmountFiltersData } = require('../../dto/data_amount_filters');
const { queryDataAmountWithFilters } = require('../../models/data_amount_filters');
const {
  validateDataAmount,
  validateDataAmountWithFilters
} = require('../../validators');

/**
 * @swagger
 * /api/data_amount/check:
 *   post:
 *     summary: Check data amount
 *     description: Retrieves data amount information for the given unique ID
 *     tags: [Data]
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
 *                 description: Unique identifier for the data amount record
 *     responses:
 *       200:
 *         description: Data amount information
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
 *                     amount:
 *                       type: number
 *                       description: The data amount value
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
 *         description: Data amount not found
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
router.post('/check', validateDataAmount, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await queryDataAmountByUniqueId(unique_id);
    if (row) {
      res.json(responseDataAmountData(true, 'Data amount exists', true, 'queryDataAmountByUniqueId', null, row.amount));
    } else {
      throw new NotFoundError('Data amount not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/data_amount/filter:
 *   post:
 *     summary: Get data amount with filters
 *     description: Retrieves data amount information and salary statistics based on various filter parameters
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parameter_position_group:
 *                 type: string
 *                 description: Department or null if parameter_position has a value
 *               parameter_position:
 *                 type: string
 *                 description: A single Position (the user's or their additional) or null if parameter_position_group has a value
 *               parameter_seniority:
 *                 type: string
 *                 description: Can be Junior, Middle, Senior, N/A or a combination of those separated by pipe |
 *               parameter_country_salary:
 *                 type: string
 *                 description: Can be 1 or more options separated by pipe |
 *               parameter_contract_type:
 *                 type: string
 *                 description: Can be 1 or more options separated by pipe |
 *               parameter_tech:
 *                 type: string
 *                 description: Can be null or 1 or more options separated by pipe |
 *     responses:
 *       200:
 *         description: Data amount and salary statistics
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
 *                     data_amount:
 *                       type: number
 *                       description: The data amount value
 *                     salary_net_avg:
 *                       type: number
 *                       description: Average net salary
 *                       nullable: true
 *                     salary_net_median:
 *                       type: number
 *                       description: Median net salary
 *                       nullable: true
 *                     salary_gross_avg:
 *                       type: number
 *                       description: Average gross salary
 *                       nullable: true
 *                     salary_gross_median:
 *                       type: number
 *                       description: Median gross salary
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
 *       404:
 *         description: Data not found
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
router.post('/filter', validateDataAmountWithFilters, async (req, res, next) => {
  const { 
    parameter_position_group, 
    parameter_position, 
    parameter_seniority,
    parameter_country_salary,
    parameter_contract_type,
    parameter_tech 
  } = req.body;
  try {
    const row = await queryDataAmountWithFilters(
      parameter_position_group,
      parameter_position,
      parameter_seniority,
      parameter_country_salary,
      parameter_contract_type,
      parameter_tech
    );
    if (row) {
      res.json(responseDataAmountFiltersData(
        true, 
        'Data with filters exists', 
        true, 
        'queryDataAmountWithFilters', 
        null, 
        row.data_amount,
        row.salary_net_avg,
        row.salary_net_median,
        row.salary_gross_avg,
        row.salary_gross_median
      ));
    } else {
      throw new NotFoundError('Data not found for the provided parameters');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

