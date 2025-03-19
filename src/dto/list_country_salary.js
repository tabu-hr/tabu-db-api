function responseListCountrySalaryData(success, message, exists, method, error, rows) {
  return {
    success,
    message,
    exists,
    method,
    error,
    data: rows.map(row => ({
      country_salary: row.country_salary,
      amount: row.amount,
    })),
  };
}

module.exports = {
  responseListCountrySalaryData,
};
