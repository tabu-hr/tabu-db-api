const express = require('express');
const router = express.Router();
const errorHandler = require('../../middleware/errorHandler');

// Import all route modules
const additionalPositionRoutes = require('./additional_position');
const dataAmountRoutes = require('./data_amount');
const healthRoutes = require('./health');
const listContractTypeRoutes = require('./list_contract_type');
const listCountrySalaryRoutes = require('./list_country_salary');
const listTechRoutes = require('./list_tech');
const salaryRoutes = require('./salary');
const submissionRoutes = require('./submission');
const systemRoutes = require('./system');
const tablesRoutes = require('./tables');
const userRoutes = require('./user');

// Mount routes
router.use('/additional-position', additionalPositionRoutes);
router.use('/data-amount', dataAmountRoutes);
router.use('/health', healthRoutes);
router.use('/list-contract-type', listContractTypeRoutes);
router.use('/list-country-salary', listCountrySalaryRoutes);
router.use('/list-tech', listTechRoutes);
router.use('/salary', salaryRoutes);
router.use('/submission', submissionRoutes);
router.use('/system', systemRoutes);
router.use('/tables', tablesRoutes);
router.use('/user', userRoutes);

// Apply error handling middleware last
router.use(errorHandler);

// Export the router
module.exports = router;
