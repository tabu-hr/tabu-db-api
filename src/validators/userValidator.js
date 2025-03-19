const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../errors/customErrors');

const validateUserCheck = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('isGoogleLogin').isBoolean().withMessage('isGoogleLogin must be a boolean value'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(error => ({
        type: 'field',
        msg: error.msg,
        path: error.param,
        location: error.location,
      }));
      return next(new ValidationError('Email must be valid', validationErrors));
    }
    next();
  }
];

const validateUserGet = [
  body('unique_id').isAlphanumeric().withMessage('Unique ID must be alphanumeric').isLength({ min: 8, max: 10 }).withMessage('Unique ID must be between 8 and 10 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(error => ({
        type: 'field',
        msg: error.msg,
        path: error.param,
        location: error.location,
      }));
      return next(new ValidationError('Validation failed', validationErrors));
    }
    next();
  }
];

module.exports = {
  validateUserCheck,
  validateUserGet,
};
