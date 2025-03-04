/**
 * Central export file for all validators
 * This file exports all validators from the validators directory
 * for easy importing throughout the application
 */
/**
 * Central export file for all validators
 * This file exports all validators from the validators directory
 * for easy importing throughout the application
 */

// Import express-validator utilities
const { body, param, query, validationResult } = require('express-validator');

// Import all validator modules
const userValidator = require('./userValidator');
const {
  validateCheckSubmission,
  validateGetSubmission,
  validateFilterSubmissions,
  handleValidationErrors
} = require('./submissionValidator');

const {
  validateSalaryCheck,
  validateGetSalaryById,
  validateListSalaries,
} = require('./salaryValidator');

const { validateCheckAdditionalPosition } = require('./additionalPositionValidator');
const { validateListTech } = require('./list_tech');
const { validateListCountrySalary } = require('./list_country_salary');
const { validateContractType } = require('./contract_type');
const { validateDataAmount } = require('./data_amount');

// Helper function to check validation results
const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check if there are validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors, create a ValidationError and pass it to the error handler
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.details = errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }));
      return next(error);
    }

    return next();
  };
};

// Export all validators
module.exports = {
  // User validators
  validateUser: userValidator.validateUser,
  validateUserGet: userValidator.validateUserGet,
  validateUserCheck: userValidator.validateUserCheck,

  // Submission validators
  validateSubmission: validateCheckSubmission,
  validateGetSubmission,
  validateFilterSubmissions,

  // Salary validators
  validateSalary: validateSalaryCheck,
  validateGetSalaryById,
  validateListSalaries,

  // Additional position validators
  validateAdditionalPosition: validateCheckAdditionalPosition,
  validateListTech,
  validateListCountrySalary,
  validateContractType,
  validateDataAmount,

  // Utility functions
  handleValidationErrors,
  validate,
  body,
  param,
  query,
  validationResult
};
