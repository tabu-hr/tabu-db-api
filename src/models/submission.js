const config = require('../config/config');
const {BigQuery} = require('@google-cloud/bigquery');
const {DatabaseError, NotFoundError} = require('../errors/customErrors');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

async function querySubmissionByUniqueId(unique_id) {
  const query = `
    SELECT
    position_group,
    position,
    seniority,
    tech,
    contract_type,
    country_salary
    FROM
    \`${schemaName}.submission\`
    WHERE
    unique_id = @unique_id
    LIMIT 1
`;
  const options = {
    query: query,
    params: {unique_id: unique_id},
  };

  try {
    const [rows] = await bigquery.query(options);
    return rows;
  } catch (err) {
    console.error('ERROR:', err);
    throw new NotFoundError(
      `Failed to query submission with unique_id: ${unique_id}`,
      err
    );
  }
}

async function querySubmissionTable() {
  const query = `SELECT * FROM \`${schemaName}.submission\` LIMIT 10`;
  const options = {
    query: query,
  };

  try {
    const [rows] = await bigquery.query(options);
    return rows;
  } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError('Failed to query submission table', err);
  }
}

module.exports = {
  querySubmissionByUniqueId,
  querySubmissionTable,
};
