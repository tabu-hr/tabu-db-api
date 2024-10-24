const {BigQuery} = require('@google-cloud/bigquery');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const shemaName = process.env.DB_SHEMA || 'app_demo';

async function queryBenefitTeambuildingTable() {
  const query = `SELECT * FROM \`${shemaName}.benefit_teambuilding\` LIMIT 10`;
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
  queryBenefitTeambuildingTable,
};
