// backend/src/routes/tasks.js
const express = require('express');
const router = express.Router();
const { tasks } = require('../models/queries');

router.get('/', require('../middleware/auth'), async (req, res) => {
  const result = await tasks.findByUser(req.user.id, null);
  res.json(result.rows.map(t => {
    const url = t.content_source || '';
    let sourceType = '链接';
    if (url.includes('mp.weixin.qq.com')) sourceType = '公众号';
    else if (url.includes('xiaohongshu.com')) sourceType = '小红书';
    else if (url.includes('bilibili.com')) sourceType = 'B站';
    return {
      id: t.id,
      title: t.title,
      contentSource: t.content_source,
      sourceType,
      status: t.status,
      statusText: t.status === 'completed' ? '已完成' : '待学习',
      estimatedMinutes: 10
    };
  }));
});

router.post('/', require('../middleware/auth'), async (req, res) => {
  const { title, contentSource, contentMarkdown } = req.body;
  const result = await tasks.create(req.user.id, title, contentSource, contentMarkdown);
  res.status(201).json(result.rows[0]);
});

router.get('/:id', require('../middleware/auth'), async (req, res) => {
  const result = await tasks.findById(req.params.id);
  if (!result.rows.length) return res.status(404).json({ error: 'Task not found' });
  res.json(result.rows[0]);
});

router.patch('/:id/status', require('../middleware/auth'), async (req, res) => {
  const result = await tasks.updateStatus(req.params.id, req.body.status);
  res.json(result.rows[0]);
});

module.exports = router;
