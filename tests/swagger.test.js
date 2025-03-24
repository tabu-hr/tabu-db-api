const request = require('supertest');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');

// Initialize express app for testing
const app = express();

// Combine all swagger specifications from the api directory
const swaggerApiPath = path.join(__dirname, '../src/config/swagger/api');
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'TabuDB API',
        version: '1.0.0',
        description: 'API for TabuDB services'
    },
    servers: [
        {
            url: '/api',
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
                    const finalPath = path.startsWith('/api') || path.startsWith('/swagger') 
                        ? path 
                        : `/api${path}`;
                    return { ...acc, [finalPath]: methods };
                }, {});
                Object.assign(swaggerDocument.paths, processedPaths);
            }
            if (apiSpec.schemas) {
                Object.assign(swaggerDocument.components.schemas, apiSpec.schemas);
            }
        } catch (err) {
            console.error(`Error loading swagger spec from ${file}:`, err);
        }
    }
});

// Serve Swagger UI
app.use('/swagger', swaggerUi.serve);
app.get('/swagger', swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TabuDB API Documentation',
    swaggerOptions: {
        persistAuthorization: true,
        displayOperationId: true,
        filter: true,
    },
}));

// Serve raw OpenAPI specification as JSON
app.get('/swagger/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerDocument);
});

describe('Swagger Documentation', () => {
    it('should serve Swagger JSON at /swagger/json', async () => {
        const response = await request(app).get('/swagger/json');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
        
        // Verify basic structure of Swagger JSON
        expect(response.body).toHaveProperty('openapi', '3.0.0');
        expect(response.body).toHaveProperty('info');
        expect(response.body).toHaveProperty('paths');
        expect(response.body).toHaveProperty('components');
    });
    
    it('should have API paths defined in the Swagger JSON', async () => {
        const response = await request(app).get('/swagger/json');
        expect(response.status).toBe(200);
        
        // Check that the paths object exists and has entries
        expect(response.body).toHaveProperty('paths');
        expect(Object.keys(response.body.paths).length).toBeGreaterThan(0);
        
        // Check that some critical paths exist
        const paths = Object.keys(response.body.paths);
        expect(paths).toContain('/api/tables');
    });
    
    it('should not have duplicate /api prefixes in the Swagger path definitions', async () => {
        const response = await request(app).get('/swagger/json');
        expect(response.status).toBe(200);
        
        // Get all paths and check none have a duplicate /api/api pattern
        const paths = Object.keys(response.body.paths);
        const duplicateApiPaths = paths.filter(path => path.includes('/api/api'));
        
        expect(duplicateApiPaths.length).toBe(0);
    });
});

module.exports = app;
