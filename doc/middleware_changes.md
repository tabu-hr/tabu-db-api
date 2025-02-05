# Middleware Changes

## CORS Middleware

A new CORS middleware has been added to set the `Access-Control-Allow-Origin` header globally. This middleware is used in the `src/routes/api.js` file to reduce redundancy in the route handlers.

### File: `src/middleware/cors.js`
```javascript
const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
};

module.exports = cors;
```

## Error Handling Middleware

A new error handling middleware has been added to centralize error handling and ensure consistent error responses across the application. This middleware is used in the `src/routes/api.js` file to handle errors in a uniform manner.

### File: `src/middleware/errorHandler.js`
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
};

module.exports = errorHandler;
```

## Input Validation Middleware

A new input validation middleware has been added to validate the presence of required parameters. This middleware is used in the `src/routes/api.js` file to ensure that all necessary inputs are provided before processing the request.

### File: `src/middleware/validateInput.js`
```javascript
const validateInput = (req, res, next) => {
  const { email } = req.body;
  if (req.path === '/user/check' && !email) {
    return res.status(400).json({
      success: false,
      message: 'Email parameter is required',
    });
  }
  next();
};

module.exports = validateInput;
```

## Updated Routes

The `src/routes/api.js` file has been updated to use the new middleware functions. This enhances the structure and maintainability of the code.

### File: `src/routes/api.js`
```javascript
const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const errorHandler = require('../middleware/errorHandler');
const validateInput = require('../middleware/validateInput');
const { queryUserTable, queryUserByEmail } = require('../models/user');
const { listTables, queryBigQuery } = require('../models/bigQuery');
const responseTables = require('../dto/tables');
const responseBigQuery = require('../dto/bigQuery');
const { responseUser, responseCheckUser } = require('../dto/user');

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
  const { email } = req.body;
  try {
    const rows = await queryUserByEmail(email);
    if (rows.length > 0) {
      res.json(responseCheckUser(true, 'User email exists', true, 'queryUserByEmail', null, rows[0].unique_id));
    } else {
      res.json(responseCheckUser(true, 'User email does not exist', false, 'queryUserByEmail'));
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
