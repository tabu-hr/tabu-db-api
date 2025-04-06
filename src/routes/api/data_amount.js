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
const { extractToken, authenticateToken } = require('../../middleware/auth');
router.post('/check', extractToken, authenticateToken, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await queryDataAmountByUniqueId(unique_id);
    if (row) {
      res.status(200).json(responseDataAmountData(true, 'Data amount exists', true, 'queryDataAmountByUniqueId', null, row.amount));
    } else {
      throw new NotFoundError('Data amount not found for the provided unique_id');
    }
  } catch (err) {
    console.error(`[Development] Error processing request: ${err.message}`);
    next(err);
  }
});

router.post('/filter', extractToken, authenticateToken, async (req, res, next) => {
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
      res.status(200).json(responseDataAmountFiltersData(
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
    console.error(`[Development] Error processing request: ${err.message}`);
    next(err);
  }
});

module.exports = router;
