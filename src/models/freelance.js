const config = require('../config/config');
const {DatabaseError} = require('../errors/customErrors');
const {BigQuery} = require('@google-cloud/bigquery');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

async function queryFreelanceTable() {
  const query = `SELECT * FROM \`${schemaName}.freelance\` LIMIT 10`;
  const options = {
    query: query,
  };

  try {
    const [rows] = await bigquery.query(options);
    return rows;
  } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError('Failed to query freelance table', err);
  }
}

module.exports = {
  queryFreelanceTable,
};
