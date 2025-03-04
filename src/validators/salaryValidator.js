const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('../errors/customErrors');

// Example of a salary row:
// {
//   unique_id: "B64QHVG3AT",
//   submission_timestamp: {
//     value: "2025-02-18T08:40:08.646Z"
//   },
//   salary_net: 2013,
//   salary_gross: 840,
//   salary_net_old: 1936,
//   salary_gross_old: 2257,
//   salary_net_for_avg: 2013,
//   salary_gross_for_avg: 840,
//   salary_net_old_for_avg: 1936,
//   salary_gross_old_for_avg: 2257,
//   salary_increase_index_net: "104",
//   salary_increase_index_gross: null,
//   inflation_index: "102",
//   real_salary_increase_index_net: "2",
//   real_salary_increase_index_gross: null
// }

// Individual validation rules
const validateBodyUniqueId = body('unique_id')
  .exists().withMessage('Unique ID is required')
  .isString().withMessage('Unique ID must be a string')
  .trim()
  .notEmpty().withMessage('Unique ID cannot be empty');

const validateParamUniqueId = param('unique_id')
  .exists().withMessage('Unique ID is required')
  .isString().withMessage('Unique ID must be a string')
  .trim()
  .notEmpty().withMessage('Unique ID cannot be empty');

const validateQueryUniqueId = query('unique_id')
  .optional()
  .isString().withMessage('Unique ID must be a string')
  .trim()
  .notEmpty().withMessage('Unique ID cannot be empty');

const validateSubmissionTimestamp = body('submission_timestamp.value')
  .optional()
  .isISO8601().withMessage('Submission timestamp must be a valid ISO date')
  .toDate();

const validateSalaryNet = body('salary_net')
  .optional()
  .isNumeric().withMessage('Net salary must be a number')
  .isFloat({ min: 0 }).withMessage('Net salary must be a positive number');

const validateSalaryGross = body('salary_gross')
  .optional()
  .isNumeric().withMessage('Gross salary must be a number')
  .isFloat({ min: 0 }).withMessage('Gross salary must be a positive number');

const validateSalaryNetOld = body('salary_net_old')
  .optional()
  .isNumeric().withMessage('Old net salary must be a number')
  .isFloat({ min: 0 }).withMessage('Old net salary must be a positive number');

const validateSalaryGrossOld = body('salary_gross_old')
  .optional()
  .isNumeric().withMessage('Old gross salary must be a number')
  .isFloat({ min: 0 }).withMessage('Old gross salary must be a positive number');

const validateSalaryNetForAvg = body('salary_net_for_avg')
  .optional()
  .isNumeric().withMessage('Net salary for average must be a number')
  .isFloat({ min: 0 }).withMessage('Net salary for average must be a positive number');

const validateSalaryGrossForAvg = body('salary_gross_for_avg')
  .optional()
  .isNumeric().withMessage('Gross salary for average must be a number')
  .isFloat({ min: 0 }).withMessage('Gross salary for average must be a positive number');

const validateSalaryNetOldForAvg = body('salary_net_old_for_avg')
  .optional()
  .isNumeric().withMessage('Old net salary for average must be a number')
  .isFloat({ min: 0 }).withMessage('Old net salary for average must be a positive number');

const validateSalaryGrossOldForAvg = body('salary_gross_old_for_avg')
  .optional()
  .isNumeric().withMessage('Old gross salary for average must be a number')
  .isFloat({ min: 0 }).withMessage('Old gross salary for average must be a positive number');

const validateSalaryIncreaseIndexNet = body('salary_increase_index_net')
  .optional()
  .isString().withMessage('Net salary increase index must be a string')
  .matches(/^\d+$/).withMessage('Net salary increase index must be a numeric string');

const validateSalaryIncreaseIndexGross = body('salary_increase_index_gross')
  .optional();

const validateInflationIndex = body('inflation_index')
  .optional()
  .isString().withMessage('Inflation index must be a string');

const validateRealSalaryIncreaseIndexNet = body('real_salary_increase_index_net')
  .optional()
  .isString().withMessage('Real net salary increase index must be a string');

const validateRealSalaryIncreaseIndexGross = body('real_salary_increase_index_gross')
  .optional();

// Group validation rules for different operations
const salaryCheckRules = [
  validateBodyUniqueId
];

const getSalaryByIdRules = [
  validateParamUniqueId
];

const createSalaryRules = [
  validateBodyUniqueId,
  validateSubmissionTimestamp,
  validateSalaryNet,
  validateSalaryGross,
  validateSalaryNetOld,
  validateSalaryGrossOld,
  validateSalaryNetForAvg,
  validateSalaryGrossForAvg,
  validateSalaryNetOldForAvg,
  validateSalaryGrossOldForAvg,
  validateSalaryIncreaseIndexNet,
  validateSalaryIncreaseIndexGross,
  validateInflationIndex,
  validateRealSalaryIncreaseIndexNet,
  validateRealSalaryIncreaseIndexGross
];

const updateSalaryRules = [
  validateParamUniqueId,
  validateSubmissionTimestamp,
  validateSalaryNet,
  validateSalaryGross,
  validateSalaryNetOld,
  validateSalaryGrossOld,
  validateSalaryNetForAvg,
  validateSalaryGrossForAvg,
  validateSalaryNetOldForAvg,
  validateSalaryGrossOldForAvg,
  validateSalaryIncreaseIndexNet,
  validateSalaryIncreaseIndexGross,
  validateInflationIndex,
  validateRealSalaryIncreaseIndexNet,
  validateRealSalaryIncreaseIndexGross
];

// Query parameter validation for list operation
const validateMinNet = query('min_net')
  .optional()
  .isNumeric().withMessage('Minimum net salary must be a number')
  .isFloat({ min: 0 }).withMessage('Minimum net salary must be a positive number');

const validateMaxNet = query('max_net')
  .optional()
  .isNumeric().withMessage('Maximum net salary must be a number')
  .isFloat({ min: 0 }).withMessage('Maximum net salary must be a positive number');

const validateFromDate = query('from_date')
  .optional()
  .isISO8601().withMessage('From date must be a valid ISO date')
  .toDate();

const validateSortOrder = query('sort_order')
  .optional()
  .isString().withMessage('Sort order must be a string')
  .isIn(['asc', 'desc']).withMessage('Sort order must be either "asc" or "desc"');

const listSalariesRules = [
  validateQueryUniqueId,
  validateMinNet,
  validateMaxNet,
  validateFromDate,
  validateSortOrder
];

const deleteSalaryRules = [
  validateParamUniqueId
];

// Error handler function for validation
const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const validationErrors = errors.array();
    // Explicitly call next with a ValidationError instance
      return next(new ValidationError('unique_id parameter is required for salary check', validationErrors));
  }
  
  // Only call next() if validation passes
  next();
};

// Define validate function to use the error handler
const validate = (validations) => {
  return async (req, res, next) => {
    try {
      // Run all validations
      await Promise.all(validations.map(validation => validation.run(req)));
      
      // Handle validation errors using the error handler
      // Handle validation errors using the error handler
      validationErrorHandler(req, res, next);
    } catch (error) {
      // If an unexpected error occurs during validation, wrap it in a ValidationError
      return next(new ValidationError('Validation failed', [{ msg: error.message }]));
    }
  };
};

// Create validator functions using validate
const validateSalaryCheck = validate(salaryCheckRules);
const validateGetSalaryById = validate(getSalaryByIdRules);
const validateCreateSalary = validate(createSalaryRules);
const validateUpdateSalary = validate(updateSalaryRules);
const validateListSalaries = validate(listSalariesRules);
const validateDeleteSalary = validate(deleteSalaryRules);

module.exports = {
  validateSalaryCheck,
  validateGetSalaryById,
  validateCreateSalary,
  validateUpdateSalary,
  validateListSalaries,
  validateDeleteSalary
};
