
module.exports = {
    [`/additional_position/check`]: {
        post: {
            summary: 'Check additional position data',
            description: 'Retrieves additional position data for the given unique ID',
            tags: ['Additional Positions'],
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
                                    description: 'Unique identifier for the additional position'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Additional position data',
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
                                            additional_position_group: {
                                                type: 'string',
                                                description: 'Group category of the additional position'
                                            },
                                            additional_position: {
                                                type: 'string',
                                                description: 'Specific additional position title'
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
                    description: 'Additional position not found',
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
