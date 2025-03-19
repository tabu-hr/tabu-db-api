const { ValidationError } = require('../errors/customErrors');

const validateInput = (req, res, next) => {
  const { email, unique_id } = req.body;

  // Validate email for user/check endpoint
  if (req.path === '/user/check' && !email) {
    throw new ValidationError('Email parameter is required');
  }

  // Validate unique_id for submission/check endpoint
  if (req.path === '/submission/check' && !unique_id) {
    throw new ValidationError('unique_id parameter is required for submission check');
  }

  // Validate unique_id for additional_position/check endpoint
  if (req.path === '/additional_position/check' && !unique_id) {
    throw new ValidationError('unique_id parameter is required for additional position check');
  }

  // Validate unique_id for salary/check endpoint
  if (req.path === '/salary/check' && !unique_id) {
    throw new ValidationError('unique_id parameter is required for salary check');
  }

  next();
};

module.exports = validateInput;
