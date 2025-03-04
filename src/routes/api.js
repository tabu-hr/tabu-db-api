const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const errorHandler = require('../middleware/errorHandler');
const { NotFoundError } = require('../errors/customErrors');
const { queryUserTable, queryUserByEmail } = require('../models/user');
const { querySubmissionByUniqueId } = require('../models/submission');
const { queryAdditionalPositionByUniqueId } = require('../models/additional_position');
const { listTables, queryBigQuery } = require('../models/bigQuery');
const responseTables = require('../dto/tables');
const responseBigQuery = require('../dto/bigQuery');
const { responseUser, responseCheckUser } = require('../dto/user');
const { responseSubmissionData } = require('../dto/submission');
const { responseAdditionalPositionData } = require('../dto/additional_position');
const { querySalaryByUniqueId } = require('../models/salary');
const { responseSalaryData } = require('../dto/salary');
const { queryListTechByUniqueId } = require('../models/list_tech');
const { queryListCountrySalaryByUniqueId } = require('../models/list_country_salary');
const { responseListTechData } = require('../dto/list_tech');
const { responseListCountrySalaryData } = require('../dto/list_country_salary');
const { responseContractTypeData } = require('../dto/contract_type');
const { queryContractTypeByUniqueId } = require('../models/contract_type');
const { responseDataAmountData } = require('../dto/data_amount');
const { queryDataAmountByUniqueId } = require('../models/data_amount');
const {
  validateUser,
  validateUserCheck,
  validateAdditionalPosition,
  validateSalary,
  validateSubmission,
  validateListTech,
  validateListCountrySalary,
  validateContractType,
  validateDataAmount,
  validate,
  param
} = require('../validators');


router.use(cors);

router.get('/tables', validate([
  // Add query parameter validation if needed in the future
]), async (req, res, next) => {
  try {
    const tables = await listTables();
    res.json(responseTables(true, 'tables', 'listTables', tables));
  } catch (err) {
    next(err);
  }
});

router.get('/user', validate([]), async (req, res, next) => {
  try {
    const rows = await queryUserTable();
    res.json(responseUser(true, 'user', 'queryUserTable', rows));
  } catch (err) {
    next(err);
  }
});

router.post('/user/check', validateUserCheck, async (req, res, next) => {
  const { email, isGoogleLogin, name } = req.body;
  try {
    const rows = await queryUserByEmail(email);
    if (rows.length > 0 && isGoogleLogin) {
      res.json(responseCheckUser(true, 'User email exists', true, 'queryUserByEmail', null, name, rows[0].unique_id));
    } else {
      res.json(responseCheckUser(true, 'User email does not exist', false, 'queryUserByEmail'));
    }
  } catch (err) {
    next(err);
  }
});

router.post('/submission/check', validateSubmission, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await querySubmissionByUniqueId(unique_id);
    if (row) {
      res.json(responseSubmissionData(true, 'Submission data exists', true, 'querySubmissionByUniqueId', null, row.position_group, row.position, row.seniority, row.tech, row.contract_type, row.country_salary));
    } else {
      throw new NotFoundError('Submission data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

router.post('/additional_position/check', validateAdditionalPosition, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await queryAdditionalPositionByUniqueId(unique_id);
    if (row) {
      res.json(responseAdditionalPositionData(true, 'Additional position data exists', true, 'queryAdditionalPositionByUniqueId', null, row.additional_position_group, row.additional_position));
    } else {
      throw new NotFoundError('Additional position data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

router.post('/salary/check', validateSalary, async (req, res, next) => {
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

router.post('/list_tech/check', validateListTech, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await queryListTechByUniqueId(unique_id);
    if (row) {
      res.json(responseListTechData(true, 'List tech data exists', true, 'queryListTechByUniqueId', null, row.tech, row.amount));
    } else {
      throw new NotFoundError('List tech data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

router.post('/list_country_salary/check', validateListCountrySalary, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await queryListCountrySalaryByUniqueId(unique_id);
    if (row) {
      res.json(responseListCountrySalaryData(true, 'List country salary data exists', true, 'queryListCountrySalaryByUniqueId', null, row.country_salary, row.amount));
    } else {
      throw new NotFoundError('List country salary data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

router.post('/contract_type/check', validateContractType, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await queryContractTypeByUniqueId(unique_id);
    if (row) {
      res.json(responseContractTypeData(true, 'Contract type data exists', true, 'queryContractTypeByUniqueId', null, row.contract_type, row.amount));
    } else {
      throw new NotFoundError('Contract type data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

router.post('/data_amount/check', validateDataAmount, async (req, res, next) => {
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

router.get('/:tableName', validate([
  param('tableName').isString().notEmpty().withMessage('Table name must be provided')
]), async (req, res, next) => {
  const { tableName } = req.params;
  try {
    const rows = await queryBigQuery(tableName);
    res.json(responseBigQuery(true, tableName, 'queryBigQuery', rows));
  } catch (err) {
    next(err);
  }
});

router.use(errorHandler);

module.exports = router;
