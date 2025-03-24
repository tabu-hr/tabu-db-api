const express = require('express');
const apiLimiter = require('../middleware/rateLimiter');
const router = express.Router();
const cors = require('../middleware/cors');
const errorHandler = require('../middleware/errorHandler');
const securityHeaders = require('../middleware/securityHeaders');
const bigQueryConnectionPool = require('../middleware/bigQueryConnectionPool');
const { validate, param, query } = require('../validators/index');
const { queryBigQuery } = require('../models/bigQuery');
const responseBigQuery = require('../dto/bigQuery');
const config = require('../config/config');
// Import route files
const userRoutes = require('./api/user');
const submissionRoutes = require('./api/submission');
const additionalPositionRoutes = require('./api/additional_position');
const salaryRoutes = require('./api/salary');
const listTechRoutes = require('./api/list_tech');
const listCountrySalaryRoutes = require('./api/list_country_salary');
const listContractTypeRoutes = require('./api/list_contract_type');
const dataAmountRoutes = require('./api/data_amount');
const tablesRoutes = require('./api/tables');
const systemRoutes = require('./api/system');

// Apply middlewares
router.use(cors);
router.use(apiLimiter);
router.use(securityHeaders);
router.use(bigQueryConnectionPool);

// Register routes
router.use('/user', userRoutes);
router.use('/submission', submissionRoutes);
router.use('/additional_position', additionalPositionRoutes);
router.use('/salary', salaryRoutes);
router.use('/list_tech', listTechRoutes);
router.use('/list_country_salary', listCountrySalaryRoutes);
router.use('/list_contract_type', listContractTypeRoutes);
router.use('/data_amount', dataAmountRoutes); // Also includes /data_amount/filter route
router.use('/', tablesRoutes); // Contains both /tables and /:tableName routes
router.use('/system', systemRoutes);

router.get('/:tableName', [
  validate([
    param('tableName').isString().withMessage('tableName must be a string'),
    query('offset').optional().isInt({ min: 0 }).withMessage('offset must be a non-negative integer'),
    query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('limit must be an integer between 1 and 1000')
  ])
], async (req, res, next) => {
  try {
    const { tableName } = req.params;
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || config.pagination.limit;
    
    const rows = await queryBigQuery(tableName, limit, offset);
    
    const response = responseBigQuery(true, tableName, 'queryBigQuery', rows);
    
    res.json(response);
  } catch (err) {
    console.log('DEBUG /:tableName route - Error:', err);
    next(err);
  }
});

router.use(errorHandler);

module.exports = router;
