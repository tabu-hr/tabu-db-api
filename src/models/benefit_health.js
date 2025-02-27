const config = require('../config/config');
const {BigQuery} = require('@google-cloud/bigquery');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

async function queryBenefitHealthTable() {
  const query = `SELECT * FROM \`${schemaName}.benefit_health\` LIMIT 10`;
  const options = {
    query: query,
  };

  try {
    const [rows] = await bigquery.query(options);
    return rows;
  } catch (err) {
    console.error('ERROR:', err);
    throw err;
  }
}

module.exports = {
  queryBenefitHealthTable,
};
