const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const errorHandler = require('../middleware/errorHandler');
const validateInput = require('../middleware/validateInput');
const { queryUserTable, queryUserByEmail } = require('../models/user');
const { querySubmissionByUniqueId } = require('../models/submission');
const { listTables, queryBigQuery } = require('../models/bigQuery');
const responseTables = require('../dto/tables');
const responseBigQuery = require('../dto/bigQuery');
const { responseUser, responseCheckUser } = require('../dto/user');
const { responseSubmissionData } = require('../dto/submission');

router.use(cors);

router.get('/tables', async (req, res, next) => {
  try {
    const tables = await listTables();
    res.json(responseTables(true, 'tables', 'listTables', tables));
  } catch (err) {
    next(err);
  }
});

router.get('/user', async (req, res, next) => {
  try {
    const rows = await queryUserTable();
    res.json(responseUser(true, 'user', 'queryUserTable', rows));
  } catch (err) {
    next(err);
  }
});

router.post('/user/check', validateInput, async (req, res, next) => {
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

router.post('/submission/check', validateInput, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await querySubmissionByUniqueId(unique_id);
    if (row) {
      res.json(responseSubmissionData(true, 'Submission data exists', true, 'querySubmissionByUniqueId', null, row.position_group, row.position, row.seniority, row.tech, row.contract_type, row.country_salary));
    } else {
      res.json(responseSubmissionData(true, 'Submission data does not exist', false, 'querySubmissionByUniqueId'));
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:tableName', async (req, res, next) => {
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
