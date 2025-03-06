class ApplicationError extends Error {
constructor(message, cause) {
    super(message);
    this.name = this.constructor.name;
    this.type = 'APPLICATION_ERROR';
    this.statusCode = 500;
    this.cause = cause;
    Error.captureStackTrace(this, this.constructor);
}
}

class DatabaseError extends ApplicationError {
constructor(message, cause) {
    super(message, cause);
    this.type = 'DATABASE_ERROR';
    this.statusCode = 500;
}
}

class ValidationError extends ApplicationError {
constructor(message, cause) {
    super(message, cause);
    this.type = 'VALIDATION_ERROR';
    this.statusCode = 400;
}
}

class AuthenticationError extends ApplicationError {
constructor(message, cause) {
    super(message, cause);
    this.type = 'AUTHENTICATION_ERROR';
    this.statusCode = 401;
}
}

class AuthorizationError extends ApplicationError {
constructor(message, cause) {
    super(message, cause);
    this.type = 'AUTHORIZATION_ERROR';
    this.statusCode = 403;
}
}

class NotFoundError extends ApplicationError {
constructor(message, cause) {
    super(message, cause);
    this.type = 'NOT_FOUND_ERROR';
    this.statusCode = 404;
}
}

class CacheError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'CacheError';
    this.type = 'CACHE_ERROR';
    this.cause = cause;
  }
}

class ConfigurationError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'ConfigurationError';
    this.type = 'CONFIGURATION_ERROR';
    this.cause = cause;
  }
}

module.exports = {
  ApplicationError,
  DatabaseError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  CacheError,
  ConfigurationError
};

