const express = require('express');
const { extractToken, authenticateToken } = require('../../middleware/auth');
const apiLimiter = require('../../middleware/rateLimiter');
const router = express.Router();
const cors = require('../../middleware/cors');
const errorHandler = require('../../middleware/errorHandler');
const { NotFoundError, ValidationError } = require('../../errors/customErrors');
const securityHeaders = require('../../middleware/securityHeaders');
const bigQueryConnectionPool = require('../../middleware/bigQueryConnectionPool');
const { validateSalaryCheck } = require('../../validators/salaryValidator');
const { validationResult } = require('express-validator');
const config = require('../../config/config');
// Import required models
const { querySalaryByUniqueId } = require('../../models/salary');

// Import required DTOs
const { responseSalaryData } = require('../../dto/salary');

// Apply middleware
router.use(cors);
router.use(apiLimiter);
router.use(securityHeaders);
router.use(bigQueryConnectionPool);

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
    console.error('Salary check error:', err.message);
    next(err);
  }
});

router.use(errorHandler);

module.exports = router;
