const { ValidationError, NotFoundError, DatabaseError } = require('../errors/customErrors');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      type: 'VALIDATION_ERROR',
      message: err.message,
      errors: err.errors,
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
      path: req.path,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      type: 'NOT_FOUND_ERROR',
      message: err.message,
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      type: 'DATABASE_ERROR',
      message: err.message,
      cause: process.env.NODE_ENV === 'production' ? undefined : err.cause,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  return res.status(500).json({
    success: false,
    statusCode: 500,
    type: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
    cause: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

module.exports = errorHandler;
