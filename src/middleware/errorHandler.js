const { 
ApplicationError, 
DatabaseError, 
ValidationError, 
AuthenticationError, 
AuthorizationError,
NotFoundError
} = require('../errors/customErrors');

/**
* Global error handling middleware
* Catches all errors thrown in the application and sends appropriate response
* with consistent formatting based on error type
* 
* @param {Error} err - The error object
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next function
*/
const errorHandler = (err, req, res, next) => {
// Collect detailed request information to help with debugging
const requestInfo = {
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: process.env.NODE_ENV !== 'production' ? req.body : '[Hidden in production]',
    headers: {
    'user-agent': req.headers['user-agent'],
    'content-type': req.headers['content-type'],
    'accept': req.headers['accept']
    },
    ip: req.ip,
    userId: req.user?.id || 'Not authenticated',
    timestamp: new Date().toISOString()
};

// Log error with contextual information
console.error(`[ERROR] ${err.name || 'Error'}: ${err.message}`);
console.error(`Request Context:`, JSON.stringify(requestInfo, null, 2));

// Log original error cause if available
if (err.cause) {
    console.error(`Original Error Cause:`, err.cause);
}

// Always log stack trace
console.error(`Stack Trace:`, err.stack);

// Default error response structure
const errorResponse = {
    success: false,
    timestamp: new Date().toISOString(),
    path: req.path
};

// Handle specific error types 
if (err instanceof ApplicationError) {
    // Handle all custom application errors that extend ApplicationError
    const response = {
    ...errorResponse,
    statusCode: err.statusCode,
    type: err.type,
    message: err.message,
    };

    // Add debugging information in non-production environments
    if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
    
    // Include original error cause if available
    if (err.cause) {
        response.cause = {
        message: err.cause.message,
        stack: err.cause.stack
        };
    }
    }

    return res.status(err.statusCode).json(response);
} 

// Handle any other errors as internal server errors
const response = {
    ...errorResponse,
    statusCode: 500,
    type: 'InternalServerError',
    message: 'An unexpected error occurred'
};

// Add error details in non-production environments
if (process.env.NODE_ENV !== 'production') {
    response.error = err.message;
    response.stack = err.stack;
    
    // Include original error information if available
    if (err.cause) {
    response.cause = {
        message: err.cause.message,
        stack: err.cause.stack
    };
    }
}

return res.status(500).json(response);
};

module.exports = errorHandler;
