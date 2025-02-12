const response = (success, table, model, response = null, error = null) => {
	return {
	  success,
	  table,
	  model,
	  response,
	  error
	};
  };

const responseSubmissionData = (success, message, exists, action, error, position_group, position, seniority, tech, contract_type, country_salary) => {
  return {
    success,
    response: { message, exists, position_group, position, seniority, tech, contract_type, country_salary },
    action,
    error,
  };
};

  module.exports = {
    response,
    responseSubmissionData,
  };
