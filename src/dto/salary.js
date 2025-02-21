const response = (success, table, model, response = null, error = null) => {
  return {
    success,
    table,
    model,
    response,
    error
  };
};

function responseSalaryData(success, message, exists, action, error, salary_net, salary_gross) {
  return {
    success,
    response: { message, exists, salary_net, salary_gross },
    action,
    error,
  };
}

module.exports = {
  response,
  responseSalaryData,
};
