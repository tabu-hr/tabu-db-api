const express = require('express');
const {BigQuery} = require('@google-cloud/bigquery');
const app = express();
const port = 3000;

// Load environment variables from .env file
require('dotenv').config();

// Initialize BigQuery client with authentication
const bigquery = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function queryBigQuery(tableName) {
  const query = tableName === 'user'
    ? `SELECT * EXCEPT (password_hash) FROM \`app_demo.${tableName}\` LIMIT 10`
    : `SELECT * FROM \`app_demo.${tableName}\` LIMIT 10`;
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

async function listTables() {
  const [tables] = await bigquery.dataset('app_demo').getTables();
  return tables.map(table => table.id);
}

app.get('/api/data/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
    const rows = await queryBigQuery(tableName);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tables', async (req, res) => {
  try {
    const tables = await listTables();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
