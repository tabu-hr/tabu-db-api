function responseListTechData(success, message, exists, method, error, tech, amount) {
  return {
    success,
    message,
    exists,
    method,
    error,
    data: {
      tech,
      amount,
    },
  };
}

module.exports = {
  responseListTechData,
};
