const {BigQuery} = require('@google-cloud/bigquery');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const schemaName = process.env.DB_SCHEMA || 'app_demo';

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
