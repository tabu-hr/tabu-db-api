const config = require('../config/config');
const { NotFoundError, DatabaseError } = require('../errors/customErrors');
const { BigQuery } = require('@google-cloud/bigquery');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

/**
 * Query data amount with filters using the BigQuery function
 * @param {string} unique_id - Required unique id
 * @param {string} [parameter_position_group] - Optional position group (Department)
 * @param {string} [parameter_position] - Optional position
 * @param {string} [parameter_seniority] - Optional seniority (Junior, Middle, Senior, N/A or combinations)
 * @param {string} [parameter_country_salary] - Optional country salary options
 * @param {string} [parameter_contract_type] - Optional contract type options
 * @param {string} [parameter_tech] - Optional tech options
 * @returns {Promise<Object>} Data amount results with averages and medians
 */
async function queryDataAmountWithFilters(
  parameter_position_group = null,
  parameter_position = null,
  parameter_seniority = null,
  parameter_country_salary = null,
  parameter_contract_type = null,
  parameter_tech = null
) {
  // Validate that either parameter_position_group or parameter_position is provided, but not both
  if ((!parameter_position_group && !parameter_position) || 
      (parameter_position_group && parameter_position)) {
    throw new Error('Either parameter_position_group or parameter_position must be provided, but not both');
  }
  
  // Validate that other required parameters are provided
  if (!parameter_seniority || !parameter_country_salary || !parameter_contract_type) {
    throw new Error('parameter_seniority, parameter_country_salary, and parameter_contract_type are required');
  }
  const sqlQuery = `
    SELECT *
    FROM \`${schemaName}.getDataAmountWithFilters\`(
      @parameter_position_group,
      @parameter_position,
      @parameter_seniority,
      @parameter_country_salary,
      @parameter_contract_type,
      @parameter_tech
    );
  `;
  const options = {
    query: sqlQuery,
    params: {
      parameter_position_group: parameter_position_group,
      parameter_position: parameter_position,
      parameter_seniority: parameter_seniority,
      parameter_country_salary: parameter_country_salary,
      parameter_contract_type: parameter_contract_type,
      parameter_tech: parameter_tech,
    },
    // Add types field to specify data types for parameters, especially for null values
    types: {
      parameter_position_group: 'STRING',
      parameter_position: 'STRING',
      parameter_seniority: 'STRING',
      parameter_country_salary: 'STRING',
      parameter_contract_type: 'STRING',
      parameter_tech: 'STRING',
    },
  };

  try {
    const [rows] = await bigquery.query(options);
    if (rows.length === 0) {
      throw new NotFoundError('No data found for the provided filters');
    }
    return rows[0];
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new DatabaseError(`Error querying data with filters: ${error.message}`);
  }
}

module.exports = {
  queryDataAmountWithFilters,
};

