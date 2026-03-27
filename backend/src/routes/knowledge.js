// backend/src/routes/knowledge.js
const express = require('express');
const router = express.Router();
const { frameworks } = require('../models/queries');

router.get('/framework', require('../middleware/auth'), async (req, res) => {
  const result = await frameworks.findByUser(req.user.id);
  res.json(result.rows[0] || null);
});

module.exports = router;