const config = require('../config/config');
const {BigQuery} = require('@google-cloud/bigquery');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

async function queryUserTable() {
  const query = `SELECT * EXCEPT (password_hash) FROM \`${schemaName}.user\` LIMIT 10`;
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

async function queryUserByEmail(email) {
  const query = `SELECT * EXCEPT (password_hash) FROM \`${schemaName}.user\` WHERE email = '${email}'`;
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
  queryUserTable,
  queryUserByEmail,
};
