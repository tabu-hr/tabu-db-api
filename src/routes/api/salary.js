const express = require('express');
const router = express.Router();
const { extractToken, authenticateToken } = require('../../middleware/auth');
const { NotFoundError, ValidationError } = require('../../errors/customErrors');
const { validateSalaryCheck } = require('../../validators/salaryValidator');
const { validationResult } = require('express-validator');
const { querySalaryByUniqueId } = require('../../models/salary');
const { responseSalaryData } = require('../../dto/salary');

router.post('/check', extractToken, authenticateToken, validateSalaryCheck, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }));
      throw new ValidationError('Validation failed', validationErrors);
    }

    const { unique_id } = req.body;

    const row = await querySalaryByUniqueId(unique_id);
    if (row) {
      res.json(responseSalaryData(
        true,
        'Salary data exists',
        true,
        'querySalaryByUniqueId',
        null,
        row.salary_net,
        row.salary_gross
      ));
    } else {
      throw new NotFoundError('Salary data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
