/**
 * Create a standardized response for BigQuery data
 * @param {boolean} success - Whether the operation was successful
 * @param {string} table - The table name
 * @param {string} model - The model function name
 * @param {Object} response - The response data including records and pagination metadata
 * @param {Object} error - Any error that occurred
 * @returns {Object} - The formatted response object
 */
const response = (success, table, model, response = null, error = null) => {
	return {
	  success,
	  table,
	  model,
	  response: response ? {
      records: response.data || [],
      pagination: response.pagination || {
        limit: 10,
        offset: 0,
        hasMore: false
      }
    } : null,
	  error
	};
};

module.exports = response;
  