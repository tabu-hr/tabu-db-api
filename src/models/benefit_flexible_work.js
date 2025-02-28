const config = require('../config/config');
const {BigQuery} = require('@google-cloud/bigquery');
const {DatabaseError} = require('../errors/customErrors');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

async function queryBenefitFlexibleWorkTable() {
  const query = `SELECT * FROM \`${schemaName}.benefit_flexible_work\` LIMIT 10`;
  const options = {
    query: query,
  };

  try {
    const [rows] = await bigquery.query(options);
    return rows;
  } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError('Failed to query benefit_flexible_work table', err);
  }
}

module.exports = {
  queryBenefitFlexibleWorkTable,
};
