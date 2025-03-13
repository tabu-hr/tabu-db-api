// Temporary script to list BigQuery datasets and tables
const { BigQuery } = require('@google-cloud/bigquery');

// Initialize BigQuery client with credentials from config
const path = require('path');
const fs = require('fs');
const credentialsPath = path.resolve(process.cwd(), 'big_query_conn.json');

console.log(`Using credentials from: ${credentialsPath}`);
console.log(`Credentials file exists: ${fs.existsSync(credentialsPath)}`);

const bigquery = new BigQuery({ 
  keyFilename: credentialsPath 
});

async function listDatasetsAndTables() {
  try {
    console.log('Fetching datasets...');
    const [datasets] = await bigquery.getDatasets();
    
    if (datasets.length === 0) {
      console.log('No datasets found in this project.');
      return;
    }
    
    console.log(`Found ${datasets.length} datasets:`);
    
    // Process each dataset
    for (const dataset of datasets) {
      console.log(`\n- Dataset: ${dataset.id}`);
      
      // Get tables in this dataset
      const [tables] = await dataset.getTables();
      
      if (tables.length === 0) {
        console.log('  No tables found in this dataset.');
        continue;
      }
      
      console.log(`  Tables (${tables.length}):`);
      for (const table of tables) {
        console.log(`  • ${table.id}`);
      }
    }
  } catch (err) {
    console.error('Error fetching BigQuery datasets and tables:');
    console.error(err);
  }
}

// Execute the function
listDatasetsAndTables()
  .then(() => console.log('\nListing complete.'))
  .catch(err => console.error('Execution error:', err));

