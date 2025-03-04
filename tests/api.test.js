const request = require('supertest');
const express = require('express');
const router = require('../src/routes/api');
const config = require('../src/config/config');
const apiRoute = config.server.apiRoute;

const app = express();
app.use(express.json());
app.use('/api', router);

describe('API Endpoints', () => {
  it('should fetch tables', async () => {
    const response = await request(app).get(`${apiRoute}/tables`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should fetch user data', async () => {
    const response = await request(app).get(`${apiRoute}/user`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should check user email', async () => {
    const response = await request(app)
      .post(`${apiRoute}/user/check`)
      .send({ email: config.server.testEmail, isGoogleLogin: true });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should check list tech data', async () => {
    const response = await request(app)
      .post(`${apiRoute}/list_tech/check`)
      .send({ unique_id: config.server.testUniqueId });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should check list country salary data', async () => {
    const response = await request(app)
      .post(`${apiRoute}/list_country_salary/check`)
      .send({ unique_id: config.server.testUniqueId });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should check data amount data', async () => {
    const response = await request(app)
      .post(`${apiRoute}/data_amount/check`)
      .send({ unique_id: config.server.testUniqueId });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should check submission data', async () => {
    const response = await request(app)
      .post(`${apiRoute}/submission/check`)
      .send({ unique_id: config.server.testUniqueId });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should check additional position data', async () => {
    const response = await request(app)
      .post(`${apiRoute}/additional_position/check`)
      .send({ unique_id: config.server.testUniqueId });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should fetch data from a specific table', async () => {
    const response = await request(app).get(`${apiRoute}/salary`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
