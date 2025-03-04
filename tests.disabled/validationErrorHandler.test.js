// Import the modules used in the middleware
const { ValidationError } = require('../src/errors/customErrors');
const { emailValidation } = require('../src/validators/validationUtils');

// Mock the express-validator module with both validationResult and body
jest.mock('express-validator', () => {
  // Create a chain of functions for body validation
  const chainObj = {
    exists: () => chainObj,
    withMessage: () => chainObj,
    notEmpty: () => chainObj,
    isString: () => chainObj,
    isLength: () => chainObj,
    trim: () => chainObj,
    optional: () => chainObj,
    isObject: () => chainObj,
    isISO8601: () => chainObj,
    isAlphanumeric: () => chainObj
  };

  return {
    body: jest.fn(() => chainObj),
    validationResult: jest.fn()
  };
});

// Require our middleware with mocked dependencies
const { validationErrorHandler } = require('../src/validators/validationUtils');

const { validationResult, validateAdditionalPosition } = require('../src/validators/validationUtils');

describe.skip('validationErrorHandler', () => {
// Import the modules used in the middleware
const { ValidationError } = require('../src/errors/customErrors');
const { emailValidation } = require('../src/validators/validationUtils');

// Mock the express-validator module with both validationResult and body
jest.mock('express-validator', () => {
  // Create a chain of functions for body validation
  const chainObj = {
    exists: () => chainObj,
    withMessage: () => chainObj,
    notEmpty: () => chainObj,
    isString: () => chainObj,
    isLength: () => chainObj,
    trim: () => chainObj,
    optional: () => chainObj,
    isObject: () => chainObj,
    isISO8601: () => chainObj,
    isAlphanumeric: () => chainObj
  };

  return {
    body: jest.fn(() => chainObj),
    validationResult: jest.fn()
  };
});

// Require our middleware with mocked dependencies
const { validationErrorHandler } = require('../src/validators/validationUtils');

const { validationResult, validateAdditionalPosition } = require('../src/validators/validationUtils');

describe.skip('validationErrorHandler', () => {
// Import the modules used in the middleware
const { ValidationError } = require('../src/errors/customErrors');
const { emailValidation } = require('../src/validators/validationUtils');

// Mock the express-validator module with both validationResult and body
jest.mock('express-validator', () => {
  // Create a chain of functions for body validation
  const chainObj = {
    exists: () => chainObj,
    withMessage: () => chainObj,
    notEmpty: () => chainObj,
    isString: () => chainObj,
    isLength: () => chainObj,
    trim: () => chainObj,
    optional: () => chainObj,
    isObject: () => chainObj,
    isISO8601: () => chainObj,
    isAlphanumeric: () => chainObj
  };

  return {
    body: jest.fn(() => chainObj),
    validationResult: jest.fn()
  };
});

// Require our middleware with mocked dependencies
const { validationErrorHandler } = require('../src/validators/validationUtils');

const { validationResult, validateAdditionalPosition } = require('../src/validators/validationUtils');

describe.skip('validationErrorHandler', () => {
// Import the modules used in the middleware
const { ValidationError } = require('../src/errors/customErrors');
const { emailValidation } = require('../src/validators/validationUtils');

// Mock the express-validator module with both validationResult and body
jest.mock('express-validator', () => {
  // Create a chain of functions for body validation
  const chainObj = {
    exists: () => chainObj,
    withMessage: () => chainObj,
    notEmpty: () => chainObj,
    isString: () => chainObj,
    isLength: () => chainObj,
    trim: () => chainObj,
    optional: () => chainObj,
    isObject: () => chainObj,
    isISO8601: () => chainObj,
    isAlphanumeric: () => chainObj
  };

  return {
    body: jest.fn(() => chainObj),
    validationResult: jest.fn()
  };
});

// Require our middleware with mocked dependencies
const { validationErrorHandler } = require('../src/validators/validationUtils');

const { validationResult, validateAdditionalPosition } = require('../src/validators/validationUtils');

describe('validationErrorHandler', () => {
  let req, res, next;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create request, response, and next function mocks
    req = {};
    res = { json: jest.fn() };
    next = jest.fn();
  });

  it('should call next with ValidationError when errors exist', () => {
    const errorMsg = 'validation error message';

    // Mock validation errors result
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: errorMsg }]
    });

    // Execute the middleware
    validationErrorHandler(req, res, next);

    // Verify validationResult was called with the request
    expect(validationResult).toHaveBeenCalledWith(req);

    // Verify next was called with a ValidationError
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(next.mock.calls[0][0].message).toBe(errorMsg);
  });

  it('should call next() without arguments when no errors exist', () => {
    // Mock validation success result
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });

    // Execute the middleware
    validationErrorHandler(req, res, next);

    // Verify validationResult was called with the request
    expect(validationResult).toHaveBeenCalledWith(req);

    // Verify next was called without arguments
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
