const { API_ROUTE } = require('./routes');

module.exports = {
  paths: {
    '/data_amount/check': {
      post: {
        summary: 'Check data amount',
        description: 'Retrieves data amount for the given unique ID',
        tags: ['Data Amount'],
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
                    description: 'Unique identifier for the data amount'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Data amount information',
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
                        exists: {
                          type: 'boolean'
                        },
                        amount: {
                          type: 'number',
                          description: 'The amount value'
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
            description: 'Data amount not found',
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
    },
    '/data_amount/filter': {
      post: {
        summary: 'Filter data amount',
        description: 'Retrieves data amount based on multiple filter parameters',
        tags: ['Data Amount'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'parameter_position_group',
                  'parameter_position',
                  'parameter_seniority',
                  'parameter_country_salary',
                  'parameter_contract_type',
                  'parameter_tech'
                ],
                properties: {
                  parameter_position_group: {
                    type: 'string',
                    description: 'Position group parameter'
                  },
                  parameter_position: {
                    type: 'string',
                    description: 'Position parameter'
                  },
                  parameter_seniority: {
                    type: 'string',
                    description: 'Seniority level parameter'
                  },
                  parameter_country_salary: {
                    type: 'string',
                    description: 'Country salary parameter'
                  },
                  parameter_contract_type: {
                    type: 'string',
                    description: 'Contract type parameter'
                  },
                  parameter_tech: {
                    type: 'string',
                    description: 'Technology parameter'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Filtered data amount information',
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
                        exists: {
                          type: 'boolean'
                        },
                        data_amount: {
                          type: 'number',
                          description: 'The amount of data matching the filters'
                        },
                        salary_net_avg: {
                          type: 'number',
                          description: 'Average net salary'
                        },
                        salary_net_median: {
                          type: 'number',
                          description: 'Median net salary'
                        },
                        salary_gross_avg: {
                          type: 'number',
                          description: 'Average gross salary'
                        },
                        salary_gross_median: {
                          type: 'number',
                          description: 'Median gross salary'
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
            description: 'Data not found',
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
  }
};
