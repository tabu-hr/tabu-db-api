const request = require('supertest');
const express = require('express');
const apiLimiter = require('../src/middleware/rateLimiter');

const app = express();
app.use(apiLimiter);

app.get('/test', (req, res) => {
  res.send('Rate limit test');
});

describe('Rate Limiter Tests', () => {
  it('should limit the number of requests to 100 within 15 minutes', async () => {
    for (let i = 0; i < 101; i++) {
      await request(app).get('/test');
    }

    const res = await request(app).get('/test');
    expect(res.status).toBe(429);
    expect(res.text).toBe('Too many requests from this IP, please try again later.');
  });
});
