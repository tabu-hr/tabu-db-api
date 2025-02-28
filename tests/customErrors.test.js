const {
  ApplicationError,
  DatabaseError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError
} = require('../src/errors/customErrors');

describe('Custom Error Classes', () => {
  describe('ApplicationError', () => {
    test('should create an instance with correct properties', () => {
      const errorMessage = 'Application error occurred';
      const cause = new Error('Original error');
      const error = new ApplicationError(errorMessage, cause);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.name).toBe('ApplicationError');
      expect(error.message).toBe(errorMessage);
      expect(error.type).toBe('APPLICATION_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.cause).toBe(cause);
      expect(error.stack).toBeDefined();
    });

    test('should work without a cause', () => {
      const errorMessage = 'Application error without cause';
      const error = new ApplicationError(errorMessage);

      expect(error.message).toBe(errorMessage);
      expect(error.cause).toBeUndefined();
    });
  });

  describe('DatabaseError', () => {
    test('should create an instance with correct properties', () => {
      const errorMessage = 'Database error occurred';
      const cause = new Error('DB connection failed');
      const error = new DatabaseError(errorMessage, cause);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApplicationError);
      expect(error).toBeInstanceOf(DatabaseError);
      expect(error.name).toBe('DatabaseError');
      expect(error.message).toBe(errorMessage);
      expect(error.type).toBe('DATABASE_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.cause).toBe(cause);
    });
  });

  describe('ValidationError', () => {
    test('should create an instance with correct properties', () => {
      const errorMessage = 'Validation error occurred';
      const error = new ValidationError(errorMessage);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApplicationError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe(errorMessage);
      expect(error.type).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
    });
  });

  describe('AuthenticationError', () => {
    test('should create an instance with correct properties', () => {
      const errorMessage = 'Authentication failed';
      const error = new AuthenticationError(errorMessage);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApplicationError);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe(errorMessage);
      expect(error.type).toBe('AUTHENTICATION_ERROR');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('AuthorizationError', () => {
    test('should create an instance with correct properties', () => {
      const errorMessage = 'Authorization failed';
      const error = new AuthorizationError(errorMessage);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApplicationError);
      expect(error).toBeInstanceOf(AuthorizationError);
      expect(error.name).toBe('AuthorizationError');
      expect(error.message).toBe(errorMessage);
      expect(error.type).toBe('AUTHORIZATION_ERROR');
      expect(error.statusCode).toBe(403);
    });
  });

  describe('NotFoundError', () => {
    test('should create an instance with correct properties', () => {
      const errorMessage = 'Resource not found';
      const error = new NotFoundError(errorMessage);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApplicationError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe(errorMessage);
      expect(error.type).toBe('NOT_FOUND_ERROR');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('Error inheritance', () => {
    test('all custom errors should inherit from ApplicationError', () => {
      expect(new DatabaseError()).toBeInstanceOf(ApplicationError);
      expect(new ValidationError()).toBeInstanceOf(ApplicationError);
      expect(new AuthenticationError()).toBeInstanceOf(ApplicationError);
      expect(new AuthorizationError()).toBeInstanceOf(ApplicationError);
      expect(new NotFoundError()).toBeInstanceOf(ApplicationError);
    });

    test('custom errors should have the correct instanceof behavior', () => {
      const dbError = new DatabaseError('DB Error');
      const validationError = new ValidationError('Invalid input');
      
      expect(dbError instanceof DatabaseError).toBe(true);
      expect(dbError instanceof ValidationError).toBe(false);
      expect(validationError instanceof ValidationError).toBe(true);
      expect(validationError instanceof DatabaseError).toBe(false);
    });
  });

  describe('Error cause handling', () => {
    test('should properly pass cause through inheritance chain', () => {
      const originalError = new Error('Original error message');
      const dbError = new DatabaseError('Database error message', originalError);
      
      expect(dbError.cause).toBe(originalError);
      expect(dbError.cause.message).toBe('Original error message');
    });
    
    test('should handle nested custom errors as causes', () => {
      const validationError = new ValidationError('Validation failed');
      const authError = new AuthenticationError('Authentication failed', validationError);
      
      expect(authError.cause).toBe(validationError);
      expect(authError.cause.statusCode).toBe(400);
      expect(authError.statusCode).toBe(401);
    });
  });
});

