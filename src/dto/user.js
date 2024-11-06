const responseUser = (success, response, action, data, error) => {
  return {
    success,
    response,
    action,
    data,
    error,
  };
};

const responseCheckUser = (success, message, exists, action, error, name) => {
  return {
    success,
    response : {message, exists, name},
    action,
    error,
  };
};

module.exports = {
  responseUser,
  responseCheckUser,
};
