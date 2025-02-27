const config = require('../config/config');
const response = (success, table, model, response = null, error = null) => {
  return {
    success,
    table,
    model,
    response,
    error
  };
};

module.exports = response;
