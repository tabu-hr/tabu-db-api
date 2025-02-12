const {BigQuery} = require('@google-cloud/bigquery');

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
      \`${shemaName}.submission\`
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
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('ERROR:', err);
    throw err;
  }
}

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const shemaName = process.env.DB_SHEMA || 'app_demo';

async function querySubmissionTable() {
  const query = `SELECT * FROM \`${shemaName}.submission\` LIMIT 10`;
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
  querySubmissionByUniqueId,
  querySubmissionTable,
};
