const response = (success, table, model, response = null, error = null) => {
	return {
	  success,
	  table,
	  model,
	  response,
	  error
	};
  };

const responseSubmissionData = (success, message, exists, action, error, row) => {
  return {
    success,
    response: { 
      message, 
      exists, 
      'position_group': row.position_group, 
      'position': row.position, 
      'seniority': row.seniority, 
      'tech': row.tech, 
      'contract_type': row.contract_type, 
      'country_salary': row.country_salary },
    action,
    error,
  };
};

  module.exports = {
    response,
    responseSubmissionData,
  };
