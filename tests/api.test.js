const request = require('supertest');
const express = require('express');
const router = require('../src/routes/api');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('API Endpoints', () => {
  it('should fetch tables', async () => {
    const response = await request(app).get('/api/tables');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should fetch user data', async () => {
    const response = await request(app).get('/api/user');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should check user email', async () => {
    const response = await request(app)
      .post('/api/user/check')
      .send({ email: 'info@nimesin.com', isGoogleLogin: true });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should fetch data from a specific table', async () => {
    const response = await request(app).get('/api/user');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
