// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { users, frameworks } = require('../models/queries');
const { generateFramework } = require('../services/frameworkGenerator');

router.post('/register', async (req, res) => {
  try {
    const { openid, username, profile } = req.body;

    // Check if user exists
    let existing = await users.findByOpenid(openid);
    if (existing.rows.length > 0) {
      const user = existing.rows[0];
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return res.json({ user, token });
    }

    // Create new user
    const created = await users.create(openid, username, profile);
    const user = created.rows[0];

    // Generate initial knowledge framework
    // User provides their own API key in profile or separate field
    const userApiKey = req.headers['x-api-key'] || profile.apiKey;
    if (userApiKey) {
      try {
        const framework = await generateFramework(profile, userApiKey);
        await frameworks.upsert(user.id, framework.name, framework.nodes, framework.edges);
      } catch (err) {
        console.error('Framework generation failed:', err.message);
        // Continue without framework - user can set up manually
      }
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', require('../middleware/auth'), async (req, res) => {
  const result = await users.findById(req.user.id);
  res.json(result.rows[0]);
});

module.exports = router;
