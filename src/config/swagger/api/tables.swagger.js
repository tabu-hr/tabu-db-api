const commonSchemas = require('../common.swagger');

/**
 * @swagger
 * /tables:
 *   get:
 *     tags:
 *       - Tables
 *     summary: Get all available tables
 *     description: Retrieves a list of all available tables in the system
 *     operationId: getTables
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "submissions"
 *                       description:
 *                         type: string
 *                         example: "Contains all submission data"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const paths = {
  '/tables': {
    get: {
      tags: ['Tables'],
      summary: 'Get all available tables',
      description: 'Retrieves a list of all available tables in the system',
      operationId: 'getTables',
      responses: {
        200: {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          example: 'submissions'
                        },
                        description: {
                          type: 'string',
                          example: 'Contains all submission data'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  }
};

module.exports = {
  paths,
  schemas: {
    ...commonSchemas
  }
};
