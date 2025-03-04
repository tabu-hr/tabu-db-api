const { body } = require('express-validator');

const validateListContractType = [
  body('unique_id').isString().notEmpty().withMessage('unique_id is required and must be a non-empty string'),
];

module.exports = {
  validateListContractType,
};
