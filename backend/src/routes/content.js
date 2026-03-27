const express = require('express');
const router = express.Router();

// Note: Content fetching uses user's own API key (passed via X-API-Key header).
// This endpoint is intentionally not auth-gated since it only fetches public URLs
// and uses the user's own AI key. Rate limiting applies in production.
router.post('/fetch', async (req, res) => {
  const { url } = req.body;
  const userApiKey = req.headers['x-api-key'];
  try {
    const result = await fetch(`${process.env.FETCHER_URL}/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    }).then(r => r.json());

    // Generate mindmap
    const mindmap = await fetch(`${process.env.FETCHER_URL}/mindmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': userApiKey
      },
      body: JSON.stringify({ content: result.markdown })
    }).then(r => r.json());

    res.json({ ...result, mindmap });
  } catch (err) {
    res.status(500).json({ error: 'Content fetch failed' });
  }
});

module.exports = router;