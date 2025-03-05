function responseListContractTypeData(success, message, exists, method, error, contract_type, amount) {
  return {
    success,
    message,
    exists,
    method,
    error,
    data: {
      contract_type,
      amount,
    },
  };
}

module.exports = {
  responseListContractTypeData,
};
