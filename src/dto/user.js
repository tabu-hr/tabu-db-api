const responseUser = (success, table, model, response = null, error = null) => {
  return {
    success,
    table,
    model,
    response,
    error
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
