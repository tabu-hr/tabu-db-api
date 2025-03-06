const request = require('supertest');
const express = require('express');
const apiLimiter = require('../src/middleware/rateLimiter');

describe('Rate Limiter Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(apiLimiter);
    app.get('/test', (req, res) => {
      res.send('Rate limit test');
    });
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should limit the number of requests to 100 within 15 minutes', async () => {
    // Make 100 concurrent requests
    const promises = Array(100).fill().map(() => 
      request(app).get('/test')
    );
    
    const responses = await Promise.all(promises);
    responses.forEach(res => {
      expect(res.status).toBe(200);
    });

    // The 101st request should be rate limited
    const res = await request(app).get('/test');
    expect(res.status).toBe(429);
    expect(JSON.parse(res.text)).toEqual({
      success: false,
      statusCode: 429,
      type: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again later.'
    });
  });
});
