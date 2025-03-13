const { BigQuery } = require('@google-cloud/bigquery');

// Initialize the BigQuery client with credentials from the file
const bigquery = new BigQuery({
  keyFilename: 'big_query_conn.json',
});

async function checkDatasetLocation() {
  try {
    console.log('Checking dataset information...');
    
    // Get dataset information
    const [dataset] = await bigquery.dataset('app_demo').get();
    
    console.log('Dataset Information:');
    console.log('- ID:', dataset.id);
    console.log('- Location:', dataset.location);
    console.log('- Project ID:', dataset.metadata.datasetReference.projectId);
    console.log('- Full Name:', `${dataset.metadata.datasetReference.projectId}:${dataset.id}`);
    console.log('- Creation Time:', new Date(parseInt(dataset.metadata.creationTime)).toISOString());
    
    // List tables in the dataset
    const [tables] = await dataset.getTables();
    
    console.log('\nTables in dataset:');
    tables.forEach(table => {
      console.log(`- ${table.id}`);
    });
    
    // Check if user table exists
    const userTable = tables.find(table => table.id === 'user');
    if (userTable) {
      console.log('\nUser table found in dataset');
    } else {
      console.log('\nWARNING: User table not found in dataset!');
    }
    
  } catch (error) {
    console.error('Error checking dataset location:', error);
    
    // If the error is about dataset not found, check all available datasets
    if (error.message.includes('Not found')) {
      try {
        console.log('\nListing all available datasets to troubleshoot:');
        const [datasets] = await bigquery.getDatasets();
        
        console.log('Available datasets:');
        for (const dataset of datasets) {
          const [metadata] = await dataset.getMetadata();
          console.log(`- ${dataset.id} (Location: ${metadata.location})`);
        }
      } catch (listError) {
        console.error('Error listing datasets:', listError);
      }
    }
  }
}

checkDatasetLocation();

