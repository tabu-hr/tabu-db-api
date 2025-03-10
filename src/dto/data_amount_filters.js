function responseDataAmountFiltersData(success, message, exists, method, error, data_amount, salary_net_avg, salary_net_median, salary_gross_avg, salary_gross_median) {
  return {
    success,
    message,
    exists,
    method,
    error,
    data: {
      data_amount,
      salary_net_avg,
      salary_net_median,
      salary_gross_avg,
      salary_gross_median
    }
  };
}

module.exports = {
  responseDataAmountFiltersData,
};
