const { validationResult } = require('express-validator');
const { ValidationError } = require('../errors/customErrors');

/**
 * Middleware to handle validation errors
 * Throws a ValidationError if validation fails
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }
  next();
};

/**
 * Helper to create custom message for required fields
 * @param {string} field - The field name
 * @returns {string} Custom error message
 */
const requiredField = (field) => `${field} is required`;

/**
 * Helper to create custom message for invalid fields
 * @param {string} field - The field name
 * @returns {string} Custom error message
 */
const invalidField = (field) => `${field} is invalid`;

/**
 * Helper to create custom message for min/max length
 * @param {string} field - The field name
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {string} Custom error message
 */
const lengthMessage = (field, min, max) => 
  `${field} must be between ${min} and ${max} characters`;

/**
 * Helper to create custom message for min/max value
 * @param {string} field - The field name
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {string} Custom error message
 */
const valueRangeMessage = (field, min, max) => 
  `${field} must be between ${min} and ${max}`;

/**
 * Helper to validate email format
 * @param {string} field - The field name for error message
 * @returns {Object} Validation chain configuration
 */
const emailValidation = (field = 'Email') => ({
  isEmail: {
    errorMessage: `${field} must be a valid email address`
  },
  normalizeEmail: true
});

/**
 * Helper to validate date format
 * @param {string} field - The field name for error message
 * @returns {Object} Validation chain configuration
 */
const dateValidation = (field = 'Date') => ({
  isDate: {
    errorMessage: `${field} must be a valid date`
  }
});

/**
 * Helper to validate numeric values
 * @param {string} field - The field name for error message
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @returns {Object} Validation chain configuration
 */
const numericValidation = (field = 'Value', min = null, max = null) => {
  const options = {
    isNumeric: {
      errorMessage: `${field} must be a number`
    }
  };
  
  if (min !== null) {
    options.isInt = {
      options: { min },
      errorMessage: `${field} must be at least ${min}`
    };
  }
  
  if (max !== null) {
    options.isInt = options.isInt || { options: {} };
    options.isInt.options.max = max;
    options.isInt.errorMessage = min !== null 
      ? `${field} must be between ${min} and ${max}` 
      : `${field} must be at most ${max}`;
  }
  
  return options;
};

/**
 * Helper to validate string length
 * @param {string} field - The field name for error message
 * @param {number} min - Minimum length (optional)
 * @param {number} max - Maximum length (optional)
 * @returns {Object} Validation chain configuration
 */
const stringLengthValidation = (field = 'Field', min = null, max = null) => {
  const options = {};
  
  if (min !== null) {
    options.isLength = {
      options: { min },
      errorMessage: `${field} must be at least ${min} characters`
    };
  }
  
  if (max !== null) {
    options.isLength = options.isLength || { options: {} };
    options.isLength.options.max = max;
    options.isLength.errorMessage = min !== null 
      ? `${field} must be between ${min} and ${max} characters` 
      : `${field} must be at most ${max} characters`;
  }
  
  return options;
};

/**
 * Helper to sanitize input
 * @returns {Object} Sanitization configuration
 */
const sanitize = () => ({
  trim: true,
  escape: true
});

module.exports = {
  handleValidationErrors,
  requiredField,
  invalidField,
  lengthMessage,
  valueRangeMessage,
  emailValidation,
  dateValidation,
  numericValidation,
  stringLengthValidation,
  sanitize
};

