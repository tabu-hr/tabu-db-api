const validateInput = require('../src/middleware/validateInput');
const { ValidationError } = require('../src/errors/customErrors');

// Mock the request, response, and next objects
const mockRequest = (path, body) => ({
  path,
  body: body || {}
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('validateInput Middleware', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('/user/check endpoint', () => {
    const path = '/user/check';

    test('should throw ValidationError when email is missing', () => {
      const req = mockRequest(path, {});
      const res = mockResponse();

      // Test that the middleware throws a ValidationError
      expect(() => {
        validateInput(req, res, mockNext);
      }).toThrow(ValidationError);

      // Test that the error message is correct
      expect(() => {
        validateInput(req, res, mockNext);
      }).toThrow('Email parameter is required');

      // Test that next() is not called
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next() when email is provided', () => {
      const req = mockRequest(path, { email: 'test@example.com' });
      const res = mockResponse();

      validateInput(req, res, mockNext);

      // Test that next() is called
      expect(mockNext).toHaveBeenCalled();
    });

    test('should work with additional parameters', () => {
      const req = mockRequest(path, { 
        email: 'test@example.com',
        isGoogleLogin: true,
        name: 'Test User'
      });
      const res = mockResponse();

      validateInput(req, res, mockNext);

      // Test that next() is called
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('/submission/check endpoint', () => {
    const path = '/submission/check';

    test('should throw ValidationError when unique_id is missing', () => {
      const req = mockRequest(path, {});
      const res = mockResponse();

      // Test that the middleware throws a ValidationError
      expect(() => {
        validateInput(req, res, mockNext);
      }).toThrow(ValidationError);

      // Test that the error message is correct
      expect(() => {
        validateInput(req, res, mockNext);
      }).toThrow('unique_id parameter is required for submission check');

      // Test that next() is not called
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next() when unique_id is provided', () => {
      const req = mockRequest(path, { unique_id: '12345' });
      const res = mockResponse();

      validateInput(req, res, mockNext);

      // Test that next() is called
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('/additional_position/check endpoint', () => {
    const path = '/additional_position/check';

    test('should throw ValidationError when unique_id is missing', () => {
      const req = mockRequest(path, {});
      const res = mockResponse();

      // Test that the middleware throws a ValidationError
      expect(() => {
        validateInput(req, res, mockNext);
      }).toThrow(ValidationError);

      // Test that the error message is correct
      expect(() => {
        validateInput(req, res, mockNext);
      }).toThrow('unique_id parameter is required for additional position check');

      // Test that next() is not called
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next() when unique_id is provided', () => {
      const req = mockRequest(path, { unique_id: '12345' });
      const res = mockResponse();

      validateInput(req, res, mockNext);

      // Test that next() is called
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('/salary/check endpoint', () => {
    const path = '/salary/check';

    test('should throw ValidationError when unique_id is missing', () => {
      const req = mockRequest(path, {});
      const res = mockResponse();

      // Test that the middleware throws a ValidationError
      expect(() => {
        validateInput(req, res, mockNext);
      }).toThrow(ValidationError);

      // Test that the error message is correct
      expect(() => {
        validateInput(req, res, mockNext);
      }).toThrow('unique_id parameter is required for salary check');

      // Test that next() is not called
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next() when unique_id is provided', () => {
      const req = mockRequest(path, { unique_id: '12345' });
      const res = mockResponse();

      validateInput(req, res, mockNext);

      // Test that next() is called
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('unhandled endpoints', () => {
    test('should call next() for unhandled paths without validation', () => {
      const req = mockRequest('/some/other/path', {});
      const res = mockResponse();

      validateInput(req, res, mockNext);

      // Test that next() is called without validation
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('integration with express router', () => {
    test('should mock integration with error handler middleware', () => {
      // Create a mock express handler chain
      const mockErrorHandler = jest.fn();
      
      // Mock a route handler that uses validateInput middleware
      const routeHandler = (req, res, next) => {
        try {
          validateInput(req, res, next);
          // This should only be reached if validation passes
          res.json({ success: true });
        } catch (err) {
          // Pass errors to the error handler
          mockErrorHandler(err, req, res, next);
        }
      };

      // Test with missing required parameter
      const req = mockRequest('/user/check', {});
      const res = mockResponse();

      routeHandler(req, res, mockNext);

      // Error handler should be called with ValidationError
      expect(mockErrorHandler).toHaveBeenCalled();
      const error = mockErrorHandler.mock.calls[0][0];
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Email parameter is required');
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe('VALIDATION_ERROR');
    });
  });
});

