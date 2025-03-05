function responseListContractTypeData(success, message, exists, method, error, rows) {
  return [
    {
      success,
      message,
      exists,
      method,
      error,
      data: rows.map(row => ({
        contract_type: row.contract_type,
        amount: row.amount,
      })),
    },
  ];
}

module.exports = {
  responseListContractTypeData,
};
