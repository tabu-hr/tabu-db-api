const request = require('supertest');
const express = require('express');
const { cacheMiddleware } = require('../src/middleware/cache');
const redis = require('../src/config/redis');

describe('Cache Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

afterEach(async () => {
  await redis.flushall();
  await redis.quit();
});

it('should cache responses', async () => {
  const testData = { test: 'data' };

  app.get('/test', cacheMiddleware('test'), (req, res) => {
    res.json(testData);
});

// First request - should set cache
await request(app)
  .get('/test')
  .expect(200)
  .expect(testData);

// Second request - should get from cache
await request(app)
  .get('/test')
  .expect(200)
  .expect(testData);

await new Promise(resolve => setTimeout(resolve, 100)); // Add a delay to ensure data is cached
await new Promise(resolve => setTimeout(resolve, 100)); // Add a delay to ensure data is retrieved
const cachedData = await redis.get('test::test');
    expect(JSON.parse(cachedData)).toEqual(testData);
  });
});
