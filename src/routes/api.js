const express = require('express');
const router = express.Router();
const { queryUserTable, queryUserByEmail } = require('../models/user');
const { listTables, queryBigQuery } = require('../models/bigQuery');
const responseTables = require('../dto/tables');
const responseBigQuery = require('../dto/bigQuery');
const { responseUser, responseCheckUser } = require('../dto/user');

router.get('/tables', async (req, res) => {
  try {
    const tables = await listTables();
    res.header('Access-Control-Allow-Origin', '*');
    res.json(responseTables(true, 'tables', 'listTables', tables));
  } catch (err) {
    res.header('Access-Control-Allow-Origin', '*');
    res.json(responseTables(false, 'tables', 'listTables', null, err.message));
  }
});

router.get('/user', async (req, res) => {
  try {
    const rows = await queryUserTable();
    res.header('Access-Control-Allow-Origin', '*');
    res.json(responseUser(true, 'user', 'queryUserTable', rows));
  } catch (err) {
    res.header('Access-Control-Allow-Origin', '*');
    res.json(responseUser(false, 'user', 'queryUserTable', null, err.message));
  }
});

router.get('/user/check', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(400).json(responseCheckUser(false, 'Email parameter is required'));
  }
  try {
    const rows = await queryUserByEmail(email);
    if (rows.length > 0) {
      res.header('Access-Control-Allow-Origin', '*');
    } else {
      res.json(responseCheckUser(true, 'User email exists', true, 'queryUserByEmail', null, rows.unique_id));
      res.header('Access-Control-Allow-Origin', '*');
      res.json(responseCheckUser(true, 'User email does not exist', false, 'queryUserByEmail'));
    }
  } catch (err) {
    res.header('Access-Control-Allow-Origin', '*');
    res.json(responseCheckUser(false, 'Error checking user email', err.message));
  }
});

router.get('/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
    const rows = await queryBigQuery(tableName);
    res.header('Access-Control-Allow-Origin', '*');
    res.json(responseBigQuery(true, tableName, 'queryBigQuery', rows));
  } catch (err) {
    res.header('Access-Control-Allow-Origin', '*');
    res.json(responseBigQuery(false, tableName, 'queryBigQuery', null, err.message));
  }
});

module.exports = router;
