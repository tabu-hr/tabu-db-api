const commonSchemas = require('../common.swagger');

/**
 * @swagger
 * tags:
 *   name: Technology
 *   description: Technology stack management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TechListResponse:
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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tech_name:
 *                     type: string
 *                     description: 'Name of the technology'
 *         type:
 *           type: string
 *         action:
 *           type: string
 *         error:
 *           type: object
 *           nullable: true
 */

const techListSwagger = {
    [`/list_tech/check`]: {
        post: {
            summary: 'Check technology list data',
            description: 'Retrieves technology list for the given unique ID',
            tags: ['Technology'],
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
                                    description: 'Unique identifier for the technology list'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Technology list data',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TechListResponse'
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
                    description: 'Technology list not found',
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
    paths: techListSwagger,
    schemas: {
        ...commonSchemas,
        TechListResponse: {
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
                                    tech_name: {
                                        type: 'string',
                                        description: 'Name of the technology'
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
};
