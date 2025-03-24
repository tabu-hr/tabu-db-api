module.exports = {
  paths: {
    "/system/cache-stats": {
      "get": {
        "tags": ["System"],
        "summary": "Get cache statistics",
        "responses": {
          "200": {
            "description": "Cache statistics",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CacheStatsResponse"
                }
              }
            }
          }
        }
      }
    }
  },
  schemas: {
    CacheStatsResponse: {
      "type": "object",
      "properties": {
        "success": { "type": "boolean" },
        "response": {
          "type": "object",
          "properties": {
            "message": { "type": "string" },
            "stats": {
              "type": "object",
              "properties": {
                "hits": { "type": "number" },
                "misses": { "type": "number" },
                "keys": { "type": "number" },
                "ksize": { "type": "number" },
                "vsize": { "type": "number" }
              }
            }
          }
        }
      }
    }
  }
};

const commonSchemas = require('../common.swagger');

const systemSwagger = {
  '/system/cache-stats': {
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
