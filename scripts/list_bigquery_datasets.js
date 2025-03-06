const { BigQuery } = require('@google-cloud/bigquery');
const config = require('../src/config/config');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});

async function listDatasets() {
  const [datasets] = await bigquery.getDatasets();
  console.log('Datasets:');
  datasets.forEach(dataset => console.log(dataset.id));
}

async function listTables(datasetId) {
  const [tables] = await bigquery.dataset(datasetId).getTables();
  console.log(`Tables in ${datasetId}:`);
  tables.forEach(table => console.log(table.id));
}

(async () => {
  await listDatasets();
  await listTables('app_demo');
})();
