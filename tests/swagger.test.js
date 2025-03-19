const request = require('supertest');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerRoutes = require('../src/routes/swagger');
const swaggerSpec = require('../src/config/swagger');

// Helper function to create a new app with the current NODE_ENV
const createApp = () => {
  const app = express();
  app.use(express.json());
  
  // Only enable Swagger in non-production environments
  // This mimics the behavior in src/index.js
  if (process.env.NODE_ENV !== 'production') {
    app.use('/swagger', swaggerRoutes);
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  }
  
  // Add a regular API endpoint for testing
  app.get('/api/status', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  return app;
};

// Create a test Express app with Swagger always enabled for basic tests
const app = express();
app.use(express.json());
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

describe('Swagger UI Environment Configuration', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    // Restore the original NODE_ENV after each test
    process.env.NODE_ENV = originalEnv;
  });

  describe('Development Environment', () => {
    let devApp;

    beforeEach(() => {
      // Set NODE_ENV to development
      process.env.NODE_ENV = 'development';
      devApp = createApp();
    });

    it('should have Swagger UI accessible in development environment', async () => {
      const response = await request(devApp).get('/swagger/');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
      expect(response.text).toContain('Swagger UI');
    });

    it('should have Swagger JSON endpoint accessible in development environment', async () => {
      const response = await request(devApp).get('/swagger/json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body).toHaveProperty('openapi', '3.0.0');
    });

    it('should also have regular API endpoints accessible', async () => {
      const response = await request(devApp).get('/api/status');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Production Environment', () => {
    let prodApp;

    beforeEach(() => {
      // Set NODE_ENV to production
      process.env.NODE_ENV = 'production';
      prodApp = createApp();
    });

    it('should not have Swagger UI accessible in production environment', async () => {
      const response = await request(prodApp).get('/swagger/');
      expect(response.status).toBe(404);
    });

    it('should not have Swagger JSON endpoint accessible in production environment', async () => {
      const response = await request(prodApp).get('/swagger/json');
      expect(response.status).toBe(404);
    });

    it('should still have regular API endpoints accessible', async () => {
      const response = await request(prodApp).get('/api/status');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});

