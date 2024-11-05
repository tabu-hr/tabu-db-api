const responseUser = (success, response, action, data, error) => {
  return {
    success,
    response,
    action,
    data,
    error,
  };
};

const responseCheckUser = (success, message, exists, error) => {
  return {
    success,
    response : {message, exists},
    error,
  };
};

module.exports = {
  responseUser,
  responseCheckUser,
};
