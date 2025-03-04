const config = require('../config/config');
const {BigQuery} = require('@google-cloud/bigquery');
const {DatabaseError, NotFoundError} = require('../errors/customErrors');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

async function queryAdditionalPositionTable() {
  const query = `SELECT * FROM \`${schemaName}.additional_position\` LIMIT 10`;
  const options = {
    query: query,
  };

  try {
    const [rows] = await bigquery.query(options);
    return rows;
  } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError('Failed to query additional position table', err);
  }
}

async function queryAdditionalPositionByUniqueId(unique_id) {
  const query = `
    SELECT
      additional_position_group,
      additional_position
    FROM
      \`${schemaName}.additional_position\`
    WHERE
      unique_id = @unique_id
    LIMIT 1
  `;
  const options = {
    query: query,
    params: {unique_id: unique_id},
  };

  try {
    const [rows] = await bigquery.query(options);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError(
      `Failed to query additional position with unique_id: ${unique_id}`,
      err
    );
  }
}

module.exports = {
  queryAdditionalPositionTable,
  queryAdditionalPositionByUniqueId,
};
