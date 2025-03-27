const { API_ROUTE } = require('./routes');
const commonSchemas = require('../common.swagger');

/**
 * @swagger
 * tags:
 *   name: Submissions
 *   description: Submission management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubmissionResponse:
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
 *             data:
 *               type: object
 *         type:
 *           type: string
 *         action:
 *           type: string
 *         error:
 *           type: object
 *           nullable: true
 */

/**
 * Swagger documentation for submission endpoints
 * @type {Object}
 */
const submissionSwagger = {
  [`${API_ROUTE}/submission/check`]: {
    post: {
      summary: 'Check if a submission exists',
      description: 'Verifies if a submission with the given unique ID exists in the database',
      tags: ['Submissions'],
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
                  description: 'Unique identifier of the submission'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Submission data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SubmissionResponse'
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
          description: 'Submission not found',
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
  paths: submissionSwagger,
  schemas: {
    ...commonSchemas,
    SubmissionResponse: {
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
            data: {
              type: 'object'
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
