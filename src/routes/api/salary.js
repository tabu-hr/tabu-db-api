const express = require('express');
const apiLimiter = require('../../middleware/rateLimiter');
const router = express.Router();
const cors = require('../../middleware/cors');
const errorHandler = require('../../middleware/errorHandler');
const { NotFoundError } = require('../../errors/customErrors');
const securityHeaders = require('../../middleware/securityHeaders');
const bigQueryConnectionPool = require('../../middleware/bigQueryConnectionPool');
const { validateSalary } = require('../../validators');
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

router.post('/check', async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await querySalaryByUniqueId(unique_id);
    if (row) {
      res.json(responseSalaryData(true, 'Salary data exists', true, 'querySalaryByUniqueId', null, row.salary_net, row.salary_gross));
    } else {
      throw new NotFoundError('Salary data not found for the provided unique_id');
    }
  } catch (err) {
    console.error(`Error processing request: ${err.message}`);
    next(err);
  }
});

router.use(errorHandler);

module.exports = router;
