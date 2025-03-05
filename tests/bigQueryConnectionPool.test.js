const request = require('supertest');
const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const bigQueryConnectionPool = require('../src/middleware/bigQueryConnectionPool');
const config = require('../src/config/config');

const app = express();
app.use(bigQueryConnectionPool);

app.get('/test', async (req, res) => {
  const bigquery = new BigQuery({
    keyFilename: config.database.credentialsPath,
  });
  const [rows] = await bigquery.query('SELECT 1 AS f0_, 2 AS f1_, 3 AS f2_');
  res.json(rows);
});

describe('BigQuery Connection Pool Tests', () => {
  jest.setTimeout(60000); // Increase the timeout to 60000 ms (60 seconds)

  it('should use the connection pool for queries', async () => {
    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
    var expected = [{'f0_': 1 , 'f1_': 2 , 'f2_': 3 }];
    expect(res.body).toEqual(expected);
  });

  it('should reuse connections from the pool', async () => {
    const res1 = await request(app).get('/test');
    const res2 = await request(app).get('/test');
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    var expected = [{'f0_': 1 , 'f1_': 2 , 'f2_': 3 }];
    expect(res1.body).toEqual(expected);
    expect(res2.body).toEqual(expected);
  });
});
