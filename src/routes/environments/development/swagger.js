const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const logger = require('../../../config/logger');
const config = require('../../../config/config');

const router = express.Router();

// Combine all swagger specifications from the api directory
const swaggerApiPath = path.join(__dirname, '../../../config/swagger/api');
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'TabuDB API',
        version: '1.0.0',
        description: 'API for TabuDB services'
    },
    servers: [
        {
            url: '',
            description: 'API base URL'
        }
    ],
    paths: {},
    components: {
        schemas: {}
    }
};

// Load and combine all swagger specifications
fs.readdirSync(swaggerApiPath).forEach(file => {
    if (file.endsWith('.swagger.js')) {
        try {
            const apiSpec = require(path.join(swaggerApiPath, file));
            if (apiSpec.paths) {
                // Process paths to ensure proper /api prefix
                const processedPaths = Object.entries(apiSpec.paths).reduce((acc, [path, methods]) => {
                    // Only add apiRoute prefix if path doesn't already start with it and isn't a swagger path
                    const finalPath = path.startsWith('/swagger') || path.startsWith(`${config.server.apiRoute}`)
                        ? path
                        : `${config.server.apiRoute}${path}`;
                    return { ...acc, [finalPath]: methods };
                }, {});
                Object.assign(swaggerDocument.paths, processedPaths);
            }
            if (apiSpec.schemas) {
                Object.assign(swaggerDocument.components.schemas, apiSpec.schemas);
            }
        } catch (err) {
            logger.error(`Error loading swagger spec from ${file}:`, err);
        }
    }
});

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TabuDB API Documentation',
    swaggerOptions: {
        persistAuthorization: true,
        displayOperationId: true,
        filter: true,
    },
}));

// Serve raw OpenAPI specification as JSON
router.get('/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerDocument);
});

logger.info('Swagger UI mounted at /swagger');

module.exports = router;
