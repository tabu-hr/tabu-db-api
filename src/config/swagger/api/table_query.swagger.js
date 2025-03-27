const { API_ROUTE } = require('./routes');
const commonSchemas = require('../common.swagger');

const tableQuerySwagger = {
  [`${API_ROUTE}/{tableName}`]: {
    get: {
      summary: 'Query data from a specific table',
      description: 'Returns data from the specified table with optional pagination',
      tags: ['Tables'],
      parameters: [
        {
          in: 'path',
          name: 'tableName',
          required: true,
          description: 'Name of the table to query',
          schema: {
            type: 'string'
          }
        },
        {
          in: 'query',
          name: 'offset',
          description: 'Number of records to skip',
          schema: {
            type: 'integer',
            minimum: 0,
            default: 0
          }
        },
        {
          in: 'query',
          name: 'limit',
          description: 'Maximum number of records to return',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 1000,
            default: 100
          }
        }
      ],
      responses: {
        200: {
          description: 'Data from the specified table',
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
                      data: {
                        type: 'array',
                        items: {
                          type: 'object'
                        }
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
          description: 'Table not found',
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
  paths: tableQuerySwagger,
  schemas: {
    ...commonSchemas
  }
};
