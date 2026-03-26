// backend/src/models/queries.js
const pool = require('./db');

const users = {
  create: (openid, username, profile) =>
    pool.query(
      'INSERT INTO users(openid, username, profile) VALUES($1, $2, $3) RETURNING *',
      [openid, username, profile]
    ),
  findByOpenid: (openid) =>
    pool.query('SELECT * FROM users WHERE openid = $1', [openid]),
  findById: (id) =>
    pool.query('SELECT * FROM users WHERE id = $1', [id]),
  updateProfile: (id, profile) =>
    pool.query('UPDATE users SET profile = $2, updated_at = NOW() WHERE id = $1 RETURNING *', [id, profile]),
};

const tasks = {
  create: (userId, title, contentSource, contentMarkdown) =>
    pool.query(
      'INSERT INTO learning_tasks(user_id, title, content_source, content_markdown) VALUES($1, $2, $3, $4) RETURNING *',
      [userId, title, contentSource, contentMarkdown]
    ),
  findByUser: (userId, status) =>
    pool.query('SELECT * FROM learning_tasks WHERE user_id = $1 AND ($2 IS NULL OR status = $2) ORDER BY created_at DESC', [userId, status]),
  findById: (id) =>
    pool.query('SELECT * FROM learning_tasks WHERE id = $1', [id]),
  updateStatus: (id, status) =>
    pool.query('UPDATE learning_tasks SET status = $2, completed_at = CASE WHEN $2 = \'completed\' THEN NOW() ELSE completed_at END WHERE id = $1', [id, status]),
};

const frameworks = {
  upsert: (userId, name, nodes, edges) =>
    pool.query(
      `INSERT INTO knowledge_frameworks(user_id, name, nodes, edges)
       VALUES($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET name = $2, nodes = $3, edges = $4, updated_at = NOW()
       RETURNING *`,
      [userId, name, JSON.stringify(nodes), JSON.stringify(edges)]
    ),
  findByUser: (userId) =>
    pool.query('SELECT * FROM knowledge_frameworks WHERE user_id = $1', [userId]),
};

const discussions = {
  create: (taskId, userId) =>
    pool.query('INSERT INTO discussions(task_id, user_id) VALUES($1, $2) RETURNING *', [taskId, userId]),
  findByTaskId: (taskId) =>
    pool.query('SELECT * FROM discussions WHERE task_id = $1', [taskId]),
  appendMessage: (id, role, content) =>
    pool.query(
      'UPDATE discussions SET messages = messages || $3 WHERE id = $1 RETURNING *',
      [id, null, JSON.stringify([{ role, content, timestamp: new Date().toISOString() }])]
    ),
  appendInsight: (id, concept, content) =>
    pool.query(
      'UPDATE discussions SET insights = insights || $3 WHERE id = $1 RETURNING *',
      [id, null, JSON.stringify([{ concept, content, timestamp: new Date().toISOString() }])]
    ),
};

module.exports = { users, tasks, frameworks, discussions };