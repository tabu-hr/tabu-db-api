const responseUser = (success, table, model, response = null, error = null) => {
  return {
    success,
    table,
    model,
    response,
    error
  };
};

const responseCheckUser = (success, message, exists, action, error, name, id) => {
  return {
    success,
    response : {message, exists, name, id},
    action,
    error,
  };
};

module.exports = {
  responseUser,
  responseCheckUser,
};
