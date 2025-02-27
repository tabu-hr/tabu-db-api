const {BigQuery} = require('@google-cloud/bigquery');
const config = require('../config/config');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

async function queryBigQuery(tableName) {
  const query = tableName === 'user'
    ? `SELECT * EXCEPT (password_hash) FROM \`${schemaName}.${tableName}\` LIMIT 10`
    : `SELECT * FROM \`${schemaName}.${tableName}\` LIMIT 10`;
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

async function listTables() {
const [tables] = await bigquery.dataset(schemaName).getTables();
  return tables.map(table => table.id);
}

module.exports = {
  queryBigQuery,
  listTables,
};
