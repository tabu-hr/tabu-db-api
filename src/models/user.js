const config = require('../config/config');
const { NotFoundError, DatabaseError } = require('../errors/customErrors');
const { BigQuery } = require('@google-cloud/bigquery');

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: config.database.credentialsPath,
});
const schemaName = config.database.schema;

async function queryUserTable() {
  const query = `SELECT * EXCEPT (password_hash) FROM \`${schemaName}.user\` LIMIT 10`;
  const options = {
    query: query,
  };

  try {
    const [rows] = await bigquery.query(options);
    if (rows.length === 0) {
      throw new NotFoundError('No users found');
    }
    return rows;
  } catch (err) {
    console.error('ERROR:', err);
    if (err.code === 5) {
      throw new NotFoundError('User not found', err);
    }
    throw new DatabaseError('Failed to query user table', err);
  }
}

async function queryUserByEmail(email) {
  const query = `SELECT * EXCEPT (password_hash) FROM \`${schemaName}.user\` WHERE email = '${email}'`;
  const options = {
    query: query,
  };

  try {
    const [rows] = await bigquery.query(options);
    if (rows.length === 0) {
      throw new NotFoundError(`User with email ${email} not found`);
    }
    return rows;
  } catch (err) {
    console.error('ERROR:', err);
    if (err.code === 5) {
      throw new NotFoundError(`User with email ${email} not found`, err);
    }
    throw new DatabaseError(`Failed to query user by email: ${email}`, err);
  }
}

module.exports = {
  queryUserTable,
  queryUserByEmail,
};
