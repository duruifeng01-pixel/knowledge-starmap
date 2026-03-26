// backend/src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const knowledgeRoutes = require('./routes/knowledge');
const contentRoutes = require('./routes/content');
const discussionRoutes = require('./routes/discussions');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/discussions', discussionRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
