function responseDataAmountData(success, message, exists, method, error, amount) {
  return {
    success,
    message,
    exists,
    action: method,
    type: 'data_amount',
    error,
    data: {
      amount: amount,
    }
  };
}

module.exports = {
  responseDataAmountData,
};
