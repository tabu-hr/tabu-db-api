const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../errors/customErrors');

const validateCheckSubmission = [
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
      return next(new ValidationError('unique_id parameter is required for submission check', validationErrors));
    }
    next();
  }
];

const validateFilterSubmissions = [
  body('date').isISO8601().toDate().withMessage('Date must be a valid ISO 8601 date string'),
  body('company_id').isAlphanumeric().withMessage('Company ID must be alphanumeric'),
  body('position_id').isAlphanumeric().withMessage('Position ID must be alphanumeric'),
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
  validateCheckSubmission,
  validateFilterSubmissions
};
