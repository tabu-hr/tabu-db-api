const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

// Basic API information
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tabu DB API',
      version: '1.0.0',
      description: 'REST API for accessing Tabu database information',
      contact: {
        name: 'API Support',
        url: 'https://github.com/tabu-hr/tabu-db-api'
      }
    },
    servers: [
      {
        url: '',
        description: 'API server'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            response: {
              type: 'object',
              properties: {
                message: {
                  type: 'string'
                }
              }
            },
            action: {
              type: 'string'
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string'
                },
                status: {
                  type: 'integer'
                }
              }
            }
          }
        },
        GenericResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            response: {
              type: 'object',
              properties: {
                message: {
                  type: 'string'
                },
                data: {
                  type: 'object'
                }
              }
            },
            action: {
              type: 'string'
            },
            error: {
              type: 'null'
            }
          }
        },
        TablesResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            response: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'tables'
                },
                data: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              }
            },
            action: {
              type: 'string',
              example: 'listTables'
            },
            error: {
              type: 'null'
            }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            response: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'user'
                },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      unique_id: {
                        type: 'string'
                      },
                      name: {
                        type: 'string'
                      },
                      email: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            },
            action: {
              type: 'string',
              example: 'queryUserTable'
            },
            error: {
              type: 'null'
            }
          }
        },
        UserCheckResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
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
                name: {
                  type: 'string'
                },
                unique_id: {
                  type: 'string'
                }
              }
            },
            action: {
              type: 'string',
              example: 'queryUserByEmail'
            },
            error: {
              type: 'null'
            }
          }
        },
        TableDataResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            response: {
              type: 'object',
              properties: {
                message: {
                  type: 'string'
                },
                data: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object'
                      }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: {
                          type: 'integer'
                        },
                        limit: {
                          type: 'integer'
                        },
                        offset: {
                          type: 'integer'
                        }
                      }
                    }
                  }
                }
              }
            },
            action: {
              type: 'string',
              example: 'queryBigQuery'
            },
            error: {
              type: 'null'
            }
          }
        },
        CacheStatsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            response: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Cache statistics retrieved successfully'
                },
                stats: {
                  type: 'object',
                  properties: {
                    hits: {
                      type: 'integer'
                    },
                    misses: {
                      type: 'integer'
                    },
                    keys: {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            },
            action: {
              type: 'string',
              example: 'getCacheStats'
            },
            error: {
              type: 'null'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            response: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Validation error'
                },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      param: {
                        type: 'string',
                        description: 'The parameter that failed validation'
                      },
                      msg: {
                        type: 'string',
                        description: 'The validation error message'
                      },
                      location: {
                        type: 'string',
                        description: 'The location of the parameter (body, query, etc.)'
                      }
                    }
                  }
                }
              }
            },
            action: {
              type: 'string',
              example: 'validateRequest'
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Validation failed'
                },
                status: {
                  type: 'integer',
                  example: 400
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
            response: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Resource not found'
                }
              }
            },
            action: {
              type: 'string',
              example: 'findResource'
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'The requested resource could not be found'
                },
                status: {
                  type: 'integer',
                  example: 404
                }
              }
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'The specified resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        BadRequest: {
          description: 'The request contains invalid parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        InternalServerError: {
          description: 'An internal server error occurred',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Tables',
        description: 'Operations related to table metadata and schema'
      },
      {
        name: 'Users',
        description: 'User-related operations'
      },
      {
        name: 'Submissions',
        description: 'Submission-related operations'
      },
      {
        name: 'Positions',
        description: 'Position-related operations'
      },
      {
        name: 'Salary',
        description: 'Salary data operations'
      },
      {
        name: 'Technologies',
        description: 'Technology-related operations'
      },
      {
        name: 'System',
        description: 'System-related operations'
      }
    ]
  },
  // Paths to the API docs
  apis: [path.join(__dirname, '../routes/*.js')], // Path to the API routes
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;

