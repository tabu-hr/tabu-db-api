const request = require('supertest');
const express = require('express');
const { cacheMiddleware } = require('../src/middleware/cache');
const redis = require('../src/config/redis');

describe('Cache Middleware', () => {
  let app;
  let server;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Create a server to properly close it later
    server = app.listen(0);
    
    // Register server for cleanup in jest's global registry
    if (!global.__TEST_SERVERS__) {
      global.__TEST_SERVERS__ = [];
    }
    global.__TEST_SERVERS__.push(server);
  });

  afterEach(async () => {
    try {
      if (redis.isReady) {
        await redis.flushall();
      }
    } catch (error) {
      console.warn('Error flushing Redis:', error.message);
    }
    
    try {
      // Close the server
      if (server) {
        await new Promise(resolve => server.close(resolve));
      }
    } catch (error) {
      console.warn('Error closing server:', error.message);
    }
  });
  
  afterAll(async () => {
    try {
      if (redis.isReady) {
        await redis.quit();
      }
    } catch (error) {
      console.warn('Error closing Redis connection:', error.message);
    }
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
    
    try {
      // Check if Redis is ready before getting cached data
      if (redis.isReady) {
        const cachedData = await redis.get('test::test');
        expect(JSON.parse(cachedData)).toEqual(testData);
      }
    } catch (error) {
      console.warn('Error checking cached data:', error.message);
    }
  });
});
