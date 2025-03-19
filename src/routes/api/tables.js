const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../../middleware/cache');
const config = require('../../config/config');
const { validate, param, query } = require('../../validators');
const { listTables, queryBigQuery } = require('../../models/bigQuery');
const responseTables = require('../../dto/tables');
const responseBigQuery = require('../../dto/bigQuery');
const { NotFoundError } = require('../../errors/customErrors');

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

module.exports = router;

