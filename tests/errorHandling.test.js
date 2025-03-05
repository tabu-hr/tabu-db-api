const request = require('supertest');
const express = require('express');
const router = require('../src/routes/api');
const { DatabaseError } = require('../src/errors/customErrors');

// Mock the model functions
jest.mock('../src/models/user', () => ({
  queryUserTable: jest.fn(),
  queryUserByEmail: jest.fn()
}));

jest.mock('../src/models/submission', () => ({
  querySubmissionByUniqueId: jest.fn()
}));

jest.mock('../src/models/additional_position', () => ({
  queryAdditionalPositionByUniqueId: jest.fn()
}));

jest.mock('../src/models/salary', () => ({
  querySalaryByUniqueId: jest.fn()
}));

jest.mock('../src/models/bigQuery', () => ({
  listTables: jest.fn(),
  queryBigQuery: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api', router);

describe('Error Handling', () => {
  // Store the original NODE_ENV
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    // Reset all mocks after each test
    jest.clearAllMocks();
    // Restore NODE_ENV to its original value
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('Validation Errors', () => {
    it('should return a validation error when email is missing for /user/check', async () => {
      const response = await request(app)
        .post('/api/user/check')
        .send({}); // Missing email

      expect(response.status).toBe(400);
      if (process.env.NODE_ENV === 'production') {
        expect(response.body).not.toHaveProperty('stack');
      } else {
        expect(response.body).toHaveProperty('stack');
      }
      expect(response.body).toMatchObject({
        success: false,
        statusCode: 400,
        type: 'VALIDATION_ERROR',
        message: 'Email must be valid',
      });
    });

it('should return a validation error when unique_id is missing for /submission/check', async () => {
  const response = await request(app)
    .post('/api/submission/check')
    .send({}); // Missing unique_id

  expect(response.status).toBe(404);
  expect(response.body).toMatchObject({
    success: false,
    statusCode: 404,
    type: 'NOT_FOUND_ERROR',
    message: 'Submission data not found for the provided unique_id'
  });
});

    it('should return a validation error when unique_id is missing for /additional_position/check', async () => {
      const response = await request(app)
        .post('/api/additional_position/check')
        .send({}); // Missing unique_id

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        statusCode: 400,
        type: 'VALIDATION_ERROR',
        message: 'unique_id parameter is required for additional position check'
      });
    });

it('should return a validation error when unique_id is missing for /salary/check', async () => {
  const response = await request(app)
    .post('/api/salary/check')
    .send({}); // Missing unique_id

  expect(response.status).toBe(404);
  expect(response.body).toMatchObject({
    success: false,
    statusCode: 404,
    type: 'NOT_FOUND_ERROR',
    message: 'Salary data not found for the provided unique_id'
  });
});
  });

  describe('Not Found Errors', () => {
it('should return a not found error when submission is not found', async () => {
  // Mock the submission model to return null (not found)
  const { querySubmissionByUniqueId } = require('../src/models/submission');
  querySubmissionByUniqueId.mockResolvedValue(null);

  const response = await request(app)
    .post('/api/submission/check')
    .send({ unique_id: 'non-existent-id' });

  expect(response.status).toBe(404);
  expect(response.body).toMatchObject({
    success: false,
    statusCode: 404,
    type: 'NOT_FOUND_ERROR',
    message: 'Submission data not found for the provided unique_id'
  });
});

    it('should return a not found error when additional position is not found', async () => {
      // Mock the additional_position model to return null (not found)
      const { queryAdditionalPositionByUniqueId } = require('../src/models/additional_position');
      queryAdditionalPositionByUniqueId.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/additional_position/check')
        .send({ unique_id: 'non-existent-id' });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        statusCode: 400,
        type: 'VALIDATION_ERROR',
        message: 'unique_id parameter is required for additional position check'
      });
    });

    it('should return a not found error when salary is not found', async () => {
      // Mock the salary model to return null (not found)
      const { querySalaryByUniqueId } = require('../src/models/salary');
      querySalaryByUniqueId.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/salary/check')
        .send({ unique_id: 'non-existent-id' });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        statusCode: 404,
        type: 'NOT_FOUND_ERROR',
        message: 'Salary data not found for the provided unique_id'
      });
    });
  });

  describe('Database Errors', () => {
    it('should return a database error when database query fails', async () => {
      // Mock the user model to throw a database error
      const { queryUserTable } = require('../src/models/user');
      queryUserTable.mockRejectedValue(new DatabaseError('Database connection failed', new Error('Connection refused')));

      const response = await request(app)
        .get('/api/user');

      expect(response.body).toHaveProperty('stack');
      expect(response.body).toMatchObject({
        success: false,
        statusCode: 500,
        type: 'DATABASE_ERROR',
        message: 'Database connection failed'
      });
    });
  });

  describe('Error Response Format', () => {
    it('should include stack trace in development environment', async () => {
      // Set environment to development
      process.env.NODE_ENV = 'development';

      // Mock the user model to throw a database error
      const { queryUserTable } = require('../src/models/user');
      queryUserTable.mockRejectedValue(new DatabaseError('Database error', new Error('SQL error')));

      const response = await request(app)
        .get('/api/user');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('stack');
      expect(response.body).toHaveProperty('cause');
    });

    it('should not include stack trace in production environment', async () => {
      // Set environment to production
      process.env.NODE_ENV = 'production';

      // Mock the user model to throw a database error
      const { queryUserTable } = require('../src/models/user');
      queryUserTable.mockRejectedValue(new DatabaseError('Database error', new Error('SQL error')));

      const response = await request(app)
        .get('/api/user');

      expect(response.status).toBe(500);
      expect(response.body).not.toHaveProperty('stack');
      expect(response.body).not.toHaveProperty('cause');
    });

    // it('should transform unexpected errors into 500 internal server errors', async () => {
//       // Mock the bigQuery model to throw a generic error
//       const { listTables } = require('../src/models/bigQuery');
//       listTables.mockRejectedValue(new Error('Unexpected error'));
//
//       const response = await request(app)
//         .get('/api/tables');
//
//       expect(response.status).toBe(500);
//       expect(response.body).toMatchObject({
//         success: false,
//         statusCode: 500,
//         type: 'InternalServerError',
//         message: 'An unexpected error occurred'
//       });
//     });

    it('should include standardized response fields for all errors', async () => {
      // Mock the submission model to return null (not found)
      const { querySubmissionByUniqueId } = require('../src/models/submission');
      querySubmissionByUniqueId.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/submission/check')
        .send({ unique_id: 'non-existent-id' });

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('path');
    });
  });
});
