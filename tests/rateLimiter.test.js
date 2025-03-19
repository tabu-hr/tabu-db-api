const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');

describe('Rate Limiter Tests', () => {
  let app;

  beforeEach(() => {
    // Create a test-specific rate limiter with a limit of 100 requests
    // This ensures the test works regardless of environment configuration
    const testRateLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Explicitly set to 100 for testing
      standardHeaders: true,
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          statusCode: 429,
          type: 'TOO_MANY_REQUESTS',
          message: 'Too many requests from this IP, please try again later.',
        });
      },
    });

    app = express();
    app.use(testRateLimiter);
    app.get('/test', (req, res) => {
      res.send('Rate limit test');
    });
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should limit the number of requests to 100 within 15 minutes', async () => {
    // Make 100 sequential requests instead of concurrent ones
    // This gives the rate limiter time to update its count between requests
    for (let i = 0; i < 100; i++) {
      const res = await request(app).get('/test');
      expect(res.status).toBe(200);
    }

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
