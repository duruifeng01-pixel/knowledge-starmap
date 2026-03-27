// backend/tests/e2e.test.js
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn((sql, params) => {
      // Mock users table queries
      if (sql.includes('SELECT * FROM users WHERE openid')) {
        return Promise.resolve({ rows: [], rowCount: 0 });
      }
      if (sql.includes('INSERT INTO users')) {
        return Promise.resolve({
          rows: [{ id: 1, openid: 'test_openid_123', username: 'TestUser', profile: {} }],
          rowCount: 1
        });
      }
      if (sql.includes('SELECT * FROM users WHERE id')) {
        return Promise.resolve({
          rows: [{ id: params[0], openid: 'test_openid_123', username: 'TestUser', profile: {} }],
          rowCount: 1
        });
      }
      // Mock tasks table queries
      if (sql.includes('INSERT INTO learning_tasks')) {
        return Promise.resolve({
          rows: [{ id: 1, user_id: 1, title: '如何写好新闻标题', status: 'pending' }],
          rowCount: 1
        });
      }
      if (sql.includes('SELECT * FROM learning_tasks WHERE user_id')) {
        return Promise.resolve({
          rows: [{ id: 1, user_id: 1, title: '如何写好新闻标题', status: 'pending' }],
          rowCount: 1
        });
      }
      if (sql.includes('UPDATE learning_tasks SET status')) {
        return Promise.resolve({
          rows: [{ id: 1, user_id: 1, title: '如何写好新闻标题', status: 'completed' }],
          rowCount: 1
        });
      }
      // Mock frameworks table queries
      if (sql.includes('SELECT * FROM knowledge_frameworks')) {
        return Promise.resolve({
          rows: [{ id: 1, user_id: 1, name: 'Test Framework', nodes: [], edges: [] }],
          rowCount: 1
        });
      }
      // Default
      return Promise.resolve({ rows: [], rowCount: 0 });
    }),
    end: jest.fn().mockResolvedValue(undefined),
  };
  return { Pool: jest.fn(() => mockPool) };
});

const request = require('supertest');
const app = require('../src/index');

describe('Full User Flow', () => {
  let authToken;
  let userId;

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        openid: 'test_openid_123',
        username: 'TestUser',
        profile: {
          industry: 'Journalism',
          goals: 'Better writing',
          domains: ['writing', 'research']
        }
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;
    userId = res.body.user.id;
  });

  it('creates a learning task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: '如何写好新闻标题',
        contentSource: 'https://example.com/article',
        contentMarkdown: '# 新闻标题写作技巧\n\n...'
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('如何写好新闻标题');
  });

  it('updates task status', async () => {
    const tasks = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);
    const taskId = tasks.body[0].id;

    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'completed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
  });

  it('retrieves knowledge framework', async () => {
    const res = await request(app)
      .get('/api/knowledge/framework')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
  });
});
