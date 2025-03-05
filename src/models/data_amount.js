const config = require('../config/config');
const { NotFoundError, DatabaseError } = require('../errors/customErrors');
const { BigQuery } = require('@google-cloud/bigquery');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

async function queryDataAmountByUniqueId(unique_id) {
  const sqlQuery = `
    SELECT amount
    FROM \`${schemaName}.data_amount\`
    WHERE unique_id = @unique_id
    ORDER BY amount DESC;
  `;
  const options = {
    query: sqlQuery,
    params: { unique_id },
  };
  const [rows] = await bigquery.query(options);
  if (rows.length === 0) {
    throw new NotFoundError('Data amount not found for the provided unique_id');
  }
  return rows[0];
}

module.exports = {
  queryDataAmountByUniqueId,
};
