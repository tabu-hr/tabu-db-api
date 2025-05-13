const responseUser = (success, table, model, response = null, error = null) => {
  return {
    success,
    table,
    model,
    response,
    error
  };
};

const responseCheckUser = (success, message, exists, action, error, name, id, needs_to_update, tokens = null) => {
  return {
    success,
    response: {
      message,
      exists,
      name,
      id,
      needs_to_update,
      tokens
    },
    action,
    error,
  };
};

module.exports = {
  responseUser,
  responseCheckUser,
};
