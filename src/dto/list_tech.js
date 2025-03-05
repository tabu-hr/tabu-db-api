function responseListTechData(success, message, exists, method, error, rows) {
  return [
    {
      success,
      message,
      exists,
      method,
      error,
      data: rows.map(row => ({
        tech: row.tech,
        amount: row.amount,
      })),
    },
  ];
}

module.exports = {
  responseListTechData,
};
