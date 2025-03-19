const { body, oneOf } = require('express-validator');

const validateDataAmountWithFilters = [
  // Required parameters
  body('parameter_seniority').isString().notEmpty().withMessage('parameter_seniority is required and must be a non-empty string'),
  body('parameter_country_salary').isString().notEmpty().withMessage('parameter_country_salary is required and must be a non-empty string'),
  body('parameter_contract_type').isString().notEmpty().withMessage('parameter_contract_type is required and must be a non-empty string'),
  
  // Optional parameter_tech
  body('parameter_tech').optional().isString().withMessage('parameter_tech must be a string if provided'),
  
  // Either parameter_position_group or parameter_position must be provided, but not both
  oneOf([
    [
      body('parameter_position_group').exists().isString().notEmpty().withMessage('parameter_position_group must be a non-empty string'),
      body('parameter_position').not().exists().withMessage('parameter_position should not be provided when parameter_position_group is used'),
    ],
    [
      body('parameter_position').exists().isString().notEmpty().withMessage('parameter_position must be a non-empty string'),
      body('parameter_position_group').not().exists().withMessage('parameter_position_group should not be provided when parameter_position is used'),
    ]
  ], 'Either parameter_position_group or parameter_position must be provided, but not both')
];

module.exports = {
  validateDataAmountWithFilters,
};

