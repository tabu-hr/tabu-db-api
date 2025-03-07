const express = require('express');
const apiLimiter = require('../middleware/rateLimiter');
const router = express.Router();
const cors = require('../middleware/cors');
const errorHandler = require('../middleware/errorHandler');
const { NotFoundError } = require('../errors/customErrors');
const { cacheMiddleware } = require('../middleware/cache');
const config = require('../config/config');
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
const { responseListContractTypeData } = require('../dto/list_contract_type');
const { queryListContractTypeByUniqueId } = require('../models/list_contract_type');
const { responseDataAmountData } = require('../dto/data_amount');
const { queryDataAmountByUniqueId } = require('../models/data_amount');
const securityHeaders = require('../middleware/securityHeaders');
const bigQueryConnectionPool = require('../middleware/bigQueryConnectionPool');
const {
  validateUser,
  validateUserCheck,
  validateAdditionalPosition,
  validateSalary,
  validateSubmission,
  validateListTech,
  validateListCountrySalary,
  validateListContractType,
  validateDataAmount,
  validate,
  param,
  query
} = require('../validators');
const CacheMonitor = require('../middleware/cacheMonitor');

router.use(cors);
router.use(apiLimiter);
router.use(securityHeaders);
router.use(bigQueryConnectionPool);

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Get list of all available tables
 *     description: Returns a list of all tables available in the BigQuery database
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: List of available tables
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         type: string
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tables', cacheMiddleware('tables', config.cache.durations.TABLES), async (req, res, next) => {
  try {
    const tables = await listTables();
    res.json(responseTables(true, 'tables', 'listTables', tables));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users in the database
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user', cacheMiddleware('user', config.cache.durations.USER), async (req, res, next) => {
  try {
    const rows = await queryUserTable();
    res.json(responseUser(true, 'user', 'queryUserTable', rows));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/user/check:
 *   post:
 *     summary: Check if a user exists by email
 *     description: Verifies if a user with the given email address exists in the database
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address to check
 *               isGoogleLogin:
 *                 type: boolean
 *                 description: Whether the login attempt is via Google authentication
 *               name:
 *                 type: string
 *                 description: User's name (required for Google login)
 *     responses:
 *       200:
 *         description: User check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exists:
 *                       type: boolean
 *                     name:
 *                       type: string
 *                       nullable: true
 *                     unique_id:
 *                       type: string
 *                       nullable: true
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/user/check', validateUserCheck, async (req, res, next) => {
  const { email, isGoogleLogin, name } = req.body;
  try {
    const row = await queryUserByEmail(email);
    if (row) {
      if (isGoogleLogin) {
        res.json(responseCheckUser(true, 'User email exists', true, 'queryUserByEmail', null, name, row.unique_id));
      } else {
        res.json(responseCheckUser(true, 'User email does not exist', false, 'queryUserByEmail'));
      }
    } else {
      res.json(responseCheckUser(true, 'User email does not exist', false, 'queryUserByEmail'));
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/submission/check:
 *   post:
 *     summary: Check if a submission exists
 *     description: Verifies if a submission with the given unique ID exists in the database
 *     tags: [Submissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_id
 *             properties:
 *               unique_id:
 *                 type: string
 *                 description: Unique identifier of the submission
 *     responses:
 *       200:
 *         description: Submission data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exists:
 *                       type: boolean
 *                     data:
 *                       type: object
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/submission/check', validateSubmission, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await querySubmissionByUniqueId(unique_id);
    if (row) {
      res.json(responseSubmissionData(true, 'Submission data exists', true, 'querySubmissionByUniqueId', null, row));
    } else {
      throw new NotFoundError('Submission data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/additional_position/check:
 *   post:
 *     summary: Check additional position data
 *     description: Retrieves additional position data for the given unique ID
 *     tags: [Additional Positions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_id
 *             properties:
 *               unique_id:
 *                 type: string
 *                 description: Unique identifier for the additional position
 *     responses:
 *       200:
 *         description: Additional position data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exists:
 *                       type: boolean
 *                     additional_position_group:
 *                       type: string
 *                     additional_position:
 *                       type: string
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Additional position not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/salary/check:
 *   post:
 *     summary: Check salary data
 *     description: Retrieves salary information for the given unique ID
 *     tags: [Salary]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_id
 *             properties:
 *               unique_id:
 *                 type: string
 *                 description: Unique identifier for the salary record
 *     responses:
 *       200:
 *         description: Salary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exists:
 *                       type: boolean
 *                     salary_net:
 *                       type: number
 *                     salary_gross:
 *                       type: number
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Salary data not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/list_tech/check:
 *   post:
 *     summary: Check technology list data
 *     description: Retrieves technology list for the given unique ID
 *     tags: [Technology]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_id
 *             properties:
 *               unique_id:
 *                 type: string
 *                 description: Unique identifier for the technology list
 *     responses:
 *       200:
 *         description: Technology list data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exists:
 *                       type: boolean
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Technology list not found
 *         content:
 *           application/json:
*             schema:
*               $ref: '#/components/schemas/NotFoundError'
*       500:
*         description: Server error
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Error'
*/
router.post('/list_tech/check', validateListTech, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const rows = await queryListTechByUniqueId(unique_id);
    if (rows.length > 0) {
      res.json(responseListTechData(true, 'List tech data exists', true, 'queryListTechByUniqueId', null, rows));
    } else {
      throw new NotFoundError('List tech data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/list_country_salary/check:
 *   post:
 *     summary: Check country salary data
 *     description: Retrieves country salary information for the given unique ID
 *     tags: [Salary]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_id
 *             properties:
 *               unique_id:
 *                 type: string
 *                 description: Unique identifier for the country salary data
 *     responses:
 *       200:
 *         description: Country salary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exists:
 *                       type: boolean
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           country:
 *                             type: string
 *                           salary:
 *                             type: number
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Country salary data not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/list_country_salary/check', validateListCountrySalary, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const rows = await queryListCountrySalaryByUniqueId(unique_id);
    if (rows.length > 0) {
      res.json(responseListCountrySalaryData(true, 'List country salary data exists', true, 'queryListCountrySalaryByUniqueId', null, rows));
    } else {
      throw new NotFoundError('List country salary data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/list_contract_type/check:
 *   post:
 *     summary: Check contract type data
 *     description: Retrieves contract type information for the given unique ID
 *     tags: [Contract]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_id
 *             properties:
 *               unique_id:
 *                 type: string
 *                 description: Unique identifier for the contract type data
 *     responses:
 *       200:
 *         description: Contract type data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exists:
 *                       type: boolean
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           contract_type:
 *                             type: string
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Contract type data not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/list_contract_type/check', validateListContractType, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const rows = await queryListContractTypeByUniqueId(unique_id);
    if (rows.length > 0) {
      res.json(responseListContractTypeData(true, 'List Contract type data exists', true, 'queryListContractTypeByUniqueId', null, rows));
    } else {
      throw new NotFoundError('List Contract type data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/data_amount/check:
 *   post:
 *     summary: Check data amount
 *     description: Retrieves data amount information for the given unique ID
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_id
 *             properties:
 *               unique_id:
 *                 type: string
 *                 description: Unique identifier for the data amount record
 *     responses:
 *       200:
 *         description: Data amount information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exists:
 *                       type: boolean
 *                     amount:
 *                       type: number
 *                       description: The data amount value
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Data amount not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/{tableName}:
 *   get:
 *     summary: Query data from a specific table
 *     description: Queries data from the specified table with pagination
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the table to query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 10
 *         description: Number of records to return (default is 10)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of records to skip (default is 0)
 *     responses:
 *       200:
 *         description: Table data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     data:
 *                       type: object
 *                       properties:
 *                         data:
 *                           type: array
 *                           items:
 *                             type: object
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             offset:
 *                               type: integer
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Table not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:tableName', validate([
  param('tableName').isString().notEmpty().withMessage('Table name must be provided'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be a positive integer between 1 and 1000'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
]), async (req, res, next) => {
  const { tableName } = req.params;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : config.pagination.limit;
  const offset = req.query.offset ? parseInt(req.query.offset, 10) : config.pagination.offset;
  
  try {
    const result = await queryBigQuery(tableName, limit, offset);
    const response = {
      data: result.data,
      pagination: result.pagination
    };
    res.json(responseBigQuery(true, tableName, 'queryBigQuery', response));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/system/cache-stats:
 *   get:
 *     summary: Get cache statistics
 *     description: Retrieves statistics about the application's cache usage
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Cache statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     stats:
 *                       type: object
 *                       properties:
 *                         hits:
 *                           type: integer
 *                           description: Number of cache hits
 *                         misses:
 *                           type: integer
 *                           description: Number of cache misses
 *                         keys:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Current keys in cache
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/system/cache-stats', async (req, res, next) => {
  try {
    const stats = await CacheMonitor.getStats();
    res.json({
      success: true,
      response: {
        message: 'Cache statistics retrieved successfully',
        stats
      },
      action: 'getCacheStats',
      error: null
    });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
