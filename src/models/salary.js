const config = require('../config/config');
const {DatabaseError} = require('../errors/customErrors');
const BigQueryService = require('../services/bigQueryService');

// Use the singleton BigQueryService instance
const bigQueryService = BigQueryService.getInstance();
const schemaName = config.database.schema;

async function querySalaryTable() {
  const query = `SELECT * FROM \`${schemaName}.salary\` LIMIT 10`;
  const options = {
    query: query,
  };

  try {
    const [rows] = await bigQueryService.query(options);
    return rows;
  } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError('Failed to query salary table', err);
  }
}

async function querySalaryByUniqueId(unique_id) {
  const query = `
    SELECT
      salary_net,
      salary_gross
    FROM
      \`${schemaName}.salary\`
    WHERE
      unique_id = @unique_id
    LIMIT 1
  `;
  const options = {
    query: query,
    params: {unique_id: unique_id},
  };

  try {
    const [rows] = await bigQueryService.query(options);
    return rows[0];
  } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError(
      `Failed to query salary by unique ID: ${unique_id}`,
      err
    );
  }
}

module.exports = {
  querySalaryTable,
  querySalaryByUniqueId,
};
