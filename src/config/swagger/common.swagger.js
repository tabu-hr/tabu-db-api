/**
 * @swagger
 * components:
 *   schemas:
 *     ValidationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: "VALIDATION_ERROR"
 *             message:
 *               type: string
 *               example: "Invalid input data"
 *             details:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                   message:
 *                     type: string
 *     NotFoundError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: "NOT_FOUND"
 *             message:
 *               type: string
 *               example: "Resource not found"
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: "INTERNAL_SERVER_ERROR"
 *             message:
 *               type: string
 *               example: "An unexpected error occurred"
 */

/**
 * Common Swagger schema definitions
 * @type {Object}
 */
const commonSchemas = {
  ValidationError: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'VALIDATION_ERROR'
          },
          message: {
            type: 'string',
            example: 'Invalid input data'
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  },
  NotFoundError: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'NOT_FOUND'
          },
          message: {
            type: 'string',
            example: 'Resource not found'
          }
        }
      }
    }
  },
  Error: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'INTERNAL_SERVER_ERROR'
          },
          message: {
            type: 'string',
            example: 'An unexpected error occurred'
          }
        }
      }
    }
  }
};

module.exports = commonSchemas;

