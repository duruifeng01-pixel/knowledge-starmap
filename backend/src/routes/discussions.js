// backend/src/routes/discussions.js
const express = require('express');
const router = express.Router();
const { discussions, tasks } = require('../models/queries');

router.post('/:taskId/answer', require('../middleware/auth'), async (req, res) => {
  const { taskId } = req.params;
  const { step, answer } = req.body;

  // Verify task belongs to this user
  const task = await tasks.findById(taskId);
  if (!task.rows.length) return res.status(404).json({ error: 'Task not found' });
  if (task.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

  // Get or create discussion for this task
  let disc = await discussions.findByTaskId(taskId);
  if (!disc.rows.length) {
    disc = await discussions.create(taskId, req.user.id);
  }

  // Save message
  await discussions.appendMessage(disc.rows[0].id, 'user', answer);

  res.json({ success: true });
});

module.exports = router;
