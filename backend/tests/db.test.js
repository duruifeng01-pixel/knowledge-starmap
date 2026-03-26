// backend/tests/db.test.js
const pool = require('../src/models/db');

describe('Database Schema', () => {
  afterAll(() => pool.end());

  it('can connect to database', async () => {
    const result = await pool.query('SELECT 1');
    expect(result.rows[0]['?column?']).toBe(1);
  });
});