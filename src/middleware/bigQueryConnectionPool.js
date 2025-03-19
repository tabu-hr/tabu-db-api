const {BigQuery} = require('@google-cloud/bigquery');

// Create a BigQuery client
const bigquery = new BigQuery();

// Create a connection pool
const pool = bigquery.createQueryStream();

// Add a query method to the pool object
pool.query = async (query) => {
  const [rows] = await bigquery.query(query);
  return rows;
};

// Middleware function to manage connection pooling
const bigQueryConnectionPool = (req, res, next) => {
  pool.on('error', (err) => {
    console.error('BigQuery connection pool error:', err);
    next(err);
  });

  pool.on('end', () => {
    console.log('BigQuery connection pool ended');
  });

  req.pool = pool;
  next();
};

module.exports = bigQueryConnectionPool;
