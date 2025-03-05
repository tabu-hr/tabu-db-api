function responseDataAmountData(success, message, exists, method, error, amount) {
  return {
    success,
    message,
    exists,
    method,
    error,
    data: {
      amount,
    },
  };
}

module.exports = {
  responseDataAmountData,
};
