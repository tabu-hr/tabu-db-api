const { BigQuery } = require('@google-cloud/bigquery');
const config = require('../src/config/config');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});

async function queryUserTable() {
  const query = `SELECT * EXCEPT (password_hash) FROM \`${config.database.schema}.user\` LIMIT 10`;
  const options = {
    query: query,
  };

  const [rows] = await bigquery.query(options);
  console.log('User table rows:');
  rows.forEach(row => console.log(row));
}

queryUserTable().catch(console.error);
