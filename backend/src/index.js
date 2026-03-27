// backend/src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Load routes after app is created to avoid circular dependencies
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const knowledgeRoutes = require('./routes/knowledge');
const contentRoutes = require('./routes/content');
const discussionRoutes = require('./routes/discussions');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/discussions', discussionRoutes);

module.exports = app;
