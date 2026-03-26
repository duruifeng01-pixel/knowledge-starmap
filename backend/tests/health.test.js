// backend/tests/health.test.js
const request = require('supertest');
const app = require('../src/index');

describe('Health Check', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
