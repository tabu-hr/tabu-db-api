const { API_ROUTE } = require('./routes');
const commonSchemas = require('../common.swagger');

const systemSwagger = {
  [`${API_ROUTE}/system/cache-stats`]: {
    get: {
      summary: 'Get cache statistics',
      description: 'Returns statistics about the cache system',
      tags: ['System'],
      responses: {
        200: {
          description: 'Cache statistics',
          content: {
            'application/json': {
              schema: {
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
                      stats: {
                        type: 'object',
                        description: 'Cache statistics data'
                      }
                    }
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
  paths: systemSwagger,
  schemas: {
    ...commonSchemas
  }
};
