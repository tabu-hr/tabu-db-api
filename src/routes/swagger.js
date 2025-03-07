const express = require('express');
const router = express.Router();
const swaggerSpec = require('../config/swagger');

/**
 * @swagger
 * /swagger/json:
 *   get:
 *     summary: Get Swagger specification in JSON format
 *     description: Returns the complete Swagger/OpenAPI specification as JSON
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Successful response with Swagger JSON specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

module.exports = router;

