const response = (success, table, model, response = null, error = null) => {
  return {
    success,
    table,
    model,
    response,
    error
  };
};

function responseAdditionalPositionData(success, message, exists, action, error, additional_position_group, additional_position) {
  return {
    success,
    response: { message, exists, additional_position_group, additional_position },
    action,
    error,
  };
}

module.exports = {
  response,
  responseAdditionalPositionData,
};
