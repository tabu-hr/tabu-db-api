const {BigQuery} = require('@google-cloud/bigquery');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const shemaName = process.env.DB_SHEMA || 'app_demo';

async function querySalaryTable() {
  const query = `SELECT * FROM \`${shemaName}.salary\` LIMIT 10`;
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

async function querySalaryByUniqueId(unique_id) {
  const query = `
    SELECT
      salary_net,
      salary_gross
    FROM
      \`${shemaName}.salary\`
    WHERE
      unique_id = @unique_id
    LIMIT 1
  `;
  const options = {
    query: query,
    params: { unique_id: unique_id },
  };

  try {
    const [rows] = await bigquery.query(options);
    return rows[0];
  } catch (err) {
    console.error('ERROR:', err);
    throw err;
  }
}

module.exports = {
  querySalaryTable,
  querySalaryByUniqueId,
};
