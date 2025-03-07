const request = require('supertest');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerRoutes = require('../src/routes/swagger');
const swaggerSpec = require('../src/config/swagger');

// Create a test Express app (similar to api.test.js)
const app = express();
app.use(express.json());

// Apply the Swagger routes to the app
app.use('/swagger', swaggerRoutes);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

describe('Swagger Documentation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should serve Swagger JSON at /swagger/json', async () => {
    const response = await request(app).get('/swagger/json');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    
    // Verify basic structure of Swagger JSON
    expect(response.body).toHaveProperty('openapi', '3.0.0');
    expect(response.body).toHaveProperty('info');
    expect(response.body.info).toHaveProperty('title', 'Tabu DB API');
    expect(response.body).toHaveProperty('paths');
    expect(response.body).toHaveProperty('components');
  });

  it('should serve Swagger UI at /swagger', async () => {
    const response = await request(app).get('/swagger/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    
    // Check if response contains Swagger UI HTML
    expect(response.text).toContain('Swagger UI');
    expect(response.text).toContain('swagger-ui');
  });

  it('should redirect from /swagger to /swagger/', async () => {
    const response = await request(app).get('/swagger');
    expect(response.status).toBe(301); // 301 Moved Permanently
    expect(response.headers.location).toBe('/swagger/');
  });

  it('should have API paths defined in the Swagger JSON', async () => {
    const response = await request(app).get('/swagger/json');
    expect(response.status).toBe(200);
    
    // Check that the paths object exists and has entries
    expect(response.body).toHaveProperty('paths');
    expect(Object.keys(response.body.paths).length).toBeGreaterThan(0);
    
    // Check that the specific endpoint documented in swagger.js exists
    expect(response.body.paths).toHaveProperty('/swagger/json');
  });

  it('should not have duplicate /api prefixes in the Swagger path definitions', async () => {
    const response = await request(app).get('/swagger/json');
    
    // Get all paths and check none have a duplicate /api/api pattern
    const paths = Object.keys(response.body.paths);
    const duplicateApiPaths = paths.filter(path => path.includes('/api/api'));
    
    expect(duplicateApiPaths.length).toBe(0);
  });

  afterAll(async () => {
    // Close Express server if needed
    if (app.close) {
      await new Promise(resolve => app.close(resolve));
    }
  });
});

