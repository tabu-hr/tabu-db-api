const commonSchemas = require('../common.swagger');
/**
 * @swagger
 * tags:
 *   name: Salary
 *   description: Salary management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SalaryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         response:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             exists:
 *               type: boolean
 *             salary_net:
 *               type: number
 *             salary_gross:
 *               type: number
 *         type:
 *           type: string
 *         action:
 *           type: string
 *         error:
 *           type: object
 *           nullable: true
 */

const salarySwagger = {
  '/salary/check': {
    post: {
      summary: 'Check salary data',
      description: 'Retrieves salary information for the given unique ID',
      tags: ['Salary'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['unique_id'],
              properties: {
                unique_id: {
                  type: 'string',
                  description: 'Unique identifier for the salary record'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Salary data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SalaryResponse'
              }
            }
          }
        },
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        },
        404: {
          description: 'Salary data not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundError'
              }
            }
          }
        },
        500: {
          description: 'Server error',
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
  paths: salarySwagger,
  schemas: {
    ...commonSchemas,
    SalaryResponse: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean'
        },
        response: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            exists: {
              type: 'boolean'
            },
            salary_net: {
              type: 'number'
            },
            salary_gross: {
              type: 'number'
            }
          }
        },
        type: {
          type: 'string'
        },
        action: {
          type: 'string'
        },
        error: {
          type: 'object',
          nullable: true
        }
      }
    }
  }
};
