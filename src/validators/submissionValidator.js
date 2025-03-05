const { body, param, query, validationResult } = require('express-validator');

const validateCheckSubmission = [
  body('unique_id').isString().notEmpty().withMessage('unique_id is required and must be a non-empty string'),
];

const validateGetSubmission = [
  param('unique_id').isString().notEmpty().withMessage('unique_id is required and must be a non-empty string'),
];

const validateFilterSubmissions = [
  query('position_group').optional().isString().withMessage('position_group must be a string'),
  query('position').optional().isString().withMessage('position must be a string'),
  query('seniority').optional().isString().withMessage('seniority must be a string'),
  query('tech').optional().isString().withMessage('tech must be a string'),
  query('contract_type').optional().isString().withMessage('contract_type must be a string'),
  query('country_salary').optional().isString().withMessage('country_salary must be a string'),
];

const { ValidationError } = require('../errors/customErrors');

const handleValidationErrors = (err, req, res, next) => {
  const errors = validationResult(req).array({ onlyFirstError: true });
  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
  next();
};

module.exports = {
  validateCheckSubmission,
  validateGetSubmission,
  validateFilterSubmissions,
  handleValidationErrors,
};
