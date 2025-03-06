const request = require('supertest');
const express = require('express');
const { DatabaseError } = require('../src/errors/customErrors');
const config = require('../src/config/config');
const errorHandler = require('../src/middleware/errorHandler');

// Mock the user model before requiring the router
jest.mock('../src/models/user', () => ({
  queryUserTable: jest.fn(),
  queryUserByEmail: jest.fn()
}));

// Mock BigQuery connection pool
jest.mock('../src/middleware/bigQueryConnectionPool', () => {
  return jest.fn((req, res, next) => {
    req.pool = {
      query: jest.fn().mockResolvedValue([[]]),
      on: jest.fn()
    };
    next();
  });
});

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Add a test route that will throw our error
  app.get(`${config.server.apiRoute}/user`, async (req, res, next) => {
    try {
      const { queryUserTable } = require('../src/models/user');
      await queryUserTable();
    } catch (error) {
      next(error);
    }
  });

  // Add error handler last
  app.use(errorHandler);
  return app;
};

describe('Error Handling', () => {
  let app;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
    app = createTestApp();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const redis = require('../src/config/redis');
    await redis.quit();
  });

  describe('Database Errors', () => {
    it('should return a database error when database query fails', async () => {
      const { queryUserTable } = require('../src/models/user');
      queryUserTable.mockRejectedValue(new DatabaseError('Database connection failed'));

      const response = await request(app)
        .get(`${config.server.apiRoute}/user`);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        success: false,
        statusCode: 500,
        type: 'DATABASE_ERROR',
        message: 'Database connection failed'
      });

      if (process.env.NODE_ENV === 'production') {
        expect(response.body).not.toHaveProperty('stack');
        expect(response.body).not.toHaveProperty('cause');
      } else {
        expect(response.body).toHaveProperty('stack');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('path');
      }
    });
  });

  describe('Error Response Format', () => {
    it('should include stack trace in development environment', async () => {
      process.env.NODE_ENV = 'development';
      const { queryUserTable } = require('../src/models/user');
      queryUserTable.mockRejectedValue(new DatabaseError('Database error'));

      const response = await request(app)
        .get(`${config.server.apiRoute}/user`);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        success: false,
        statusCode: 500,
        type: 'DATABASE_ERROR',
        message: 'Database error'
      });
      expect(response.body).toHaveProperty('stack');
    });

    it('should not include stack trace in production environment', async () => {
      process.env.NODE_ENV = 'production';
      const { queryUserTable } = require('../src/models/user');
      queryUserTable.mockRejectedValue(new DatabaseError('Database error'));

      const response = await request(app)
        .get(`${config.server.apiRoute}/user`);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        success: false,
        statusCode: 500,
        type: 'DATABASE_ERROR',
        message: 'Database error'
      });
      expect(response.body).not.toHaveProperty('stack');
      expect(response.body).not.toHaveProperty('cause');
    });
  });
});
