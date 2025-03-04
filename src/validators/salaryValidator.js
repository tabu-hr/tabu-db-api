const { body, param, query, validationResult } = require('express-validator');

const validateSalaryCheck = [
  body('unique_id').isString().notEmpty().withMessage('unique_id is required and must be a non-empty string'),
];

const validateGetSalaryById = [
  param('unique_id').isString().notEmpty().withMessage('unique_id is required and must be a non-empty string'),
];

const validateListSalaries = [
  query('position_group').optional().isString().withMessage('position_group must be a string'),
  query('position').optional().isString().withMessage('position must be a string'),
  query('seniority').optional().isString().withMessage('seniority must be a string'),
  query('tech').optional().isString().withMessage('tech must be a string'),
  query('contract_type').optional().isString().withMessage('contract_type must be a string'),
  query('country_salary').optional().isString().withMessage('country_salary must be a string'),
];

const handleValidationErrors = (err, req, res, next) => {
  const errors = err.array({ onlyFirstError: true });
  const errorMessages = errors.map(error => ({
    param: error.param,
    msg: error.msg,
  }));
  res.status(400).json({ errors: errorMessages });
};

module.exports = {
  validateSalaryCheck,
  validateGetSalaryById,
  validateListSalaries,
  handleValidationErrors,
};
