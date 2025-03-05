function responseListCountrySalaryData(success, message, exists, method, error, country_salary, amount) {
  return {
    success,
    message,
    exists,
    method,
    error,
    data: {
      country_salary,
      amount,
    },
  };
}

module.exports = {
  responseListCountrySalaryData,
};
