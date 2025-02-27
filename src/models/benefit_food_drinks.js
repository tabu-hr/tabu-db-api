const {BigQuery} = require('@google-cloud/bigquery');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const schemaName = process.env.DB_SCHEMA || 'app_demo';

async function queryBenefitFoodDrinksTable() {
  const query = `SELECT * FROM \`${schemaName}.benefit_food_drinks\` LIMIT 10`;
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
  queryBenefitFoodDrinksTable,
};
