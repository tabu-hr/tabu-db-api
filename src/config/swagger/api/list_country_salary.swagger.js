
module.exports = {
    [`/list_country_salary/check`]: {
        post: {
            summary: 'Check country salary data',
            description: 'Retrieves country salary information for the given unique ID',
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
                                    description: 'Unique identifier for the country salary data'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Country salary data',
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
                                                        country: {
                                                            type: 'string',
                                                            description: 'Country name'
                                                        },
                                                        salary: {
                                                            type: 'number',
                                                            description: 'Salary amount'
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
                    description: 'Country salary data not found',
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
