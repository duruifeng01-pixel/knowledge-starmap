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

const Pool = jest.fn(() => mockPool);

module.exports = { Pool };
