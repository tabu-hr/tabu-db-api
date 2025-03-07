const {BigQuery} = require('@google-cloud/bigquery');
const {DatabaseError} = require('../errors/customErrors');
const config = require('../config/config');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

/**
 * Query a BigQuery table with pagination support
 * @param {string} tableName - The name of the table to query
 * @param {number} [limit=config.pagination.limit] - The maximum number of rows to return
 * @param {number} [offset=config.pagination.offset] - The number of rows to skip
 * @returns {Promise<Array>} - The query results
 */
async function queryBigQuery(tableName, limit = config.pagination.limit, offset = config.pagination.offset) {
  // Convert parameters to integers to ensure they're valid numbers
  limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);
  
  const query =
    tableName === 'user'
      ? `SELECT * EXCEPT (password_hash) FROM \`${schemaName}.${tableName}\` LIMIT ${limit} OFFSET ${offset}`
      : `SELECT * FROM \`${schemaName}.${tableName}\` LIMIT ${limit} OFFSET ${offset}`;
  const options = {
    query: query,
  };

  try {
    const [rows] = await bigquery.query(options);
    
    // Create a result object with pagination metadata
    const result = {
      data: rows,
      pagination: {
        limit,
        offset,
        hasMore: rows.length === limit // If we got exactly 'limit' rows, there might be more
      }
    };
    
    return result;
  } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError(`Error querying BigQuery table ${tableName}`, err);
  }
}

async function listTables() {
  try {
    const [tables] = await bigquery.dataset(schemaName).getTables();
    return tables.map((table) => table.id);
  } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError('Error listing BigQuery tables', err);
  }
}

module.exports = {
  queryBigQuery,
  listTables,
};
