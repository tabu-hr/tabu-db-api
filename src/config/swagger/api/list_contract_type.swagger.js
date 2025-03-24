const commonSchemas = require('../common.swagger');

/**
 * @swagger
 * tags:
 *   name: Contract
 *   description: Contract type management endpoints
 */

const contractTypeSwagger = {
    '/list_contract_type/check': {
        post: {
            summary: 'Check contract type data',
            description: 'Retrieves contract type information for the given unique ID',
            tags: ['Contract'],
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
                                    description: 'Unique identifier for the contract type data'
                                }
                            }
                        },
                        example: {
                            unique_id: "7FUDPNHQAS"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Contract type data',
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
                                            data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        contract_type: {
                                                            type: 'string'
                                                        }
                                                    }
                                                }
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
                            },
                            example: {
                                success: true,
                                response: {
                                    message: "List Contract type data exists",
                                    exists: true,
                                    data: [
                                        {
                                            contract_type: "Permanent employment contract"
                                        }
                                    ]
                                },
                                type: "CONTRACT_TYPE",
                                action: "queryListContractTypeByUniqueId",
                                error: null
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
                    description: 'Contract type data not found',
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
    paths: contractTypeSwagger,
    schemas: {
        ...commonSchemas
    }
};
