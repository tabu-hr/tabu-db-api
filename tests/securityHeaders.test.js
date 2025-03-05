const request = require('supertest');
const express = require('express');
const securityHeaders = require('../src/middleware/securityHeaders');

const app = express();
app.use(securityHeaders);

app.get('/test', (req, res) => {
  res.send('Security Headers Test');
});

describe('Security Headers Tests', () => {
  it('should set the correct security headers', async () => {
    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
    expect(res.headers['content-security-policy']).toBe("default-src 'self';script-src 'self' 'unsafe-inline';style-src 'self' 'unsafe-inline';img-src 'self' data:;font-src 'self';connect-src 'self';frame-src 'self';object-src 'none';upgrade-insecure-requests;base-uri 'self';form-action 'self';frame-ancestors 'self';script-src-attr 'none'");
    expect(res.headers['referrer-policy']).toBe('no-referrer');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-download-options']).toBe('noopen');
    expect(res.headers['x-permitted-cross-domain-policies']).toBe('none');
    expect(res.headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains; preload');
    if (res.request.protocol === 'https') {
  expect(res.headers['x-xss-protection']).toBe('1; mode=block');
} else {
  expect(res.headers['x-xss-protection']).toBe('0');
}
  });
});
