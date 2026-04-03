const express = require('express');
const router = express.Router();

/**
 * POST /api/context/validate
 * Validates the structure/length of a medical context string.
 */
router.post('/validate', (req, res) => {
  const { context } = req.body;

  if (typeof context !== 'string') {
    return res.status(400).json({ error: 'Context must be a string.' });
  }

  const wordCount = context.trim().split(/\s+/).filter(Boolean).length;
  const charCount = context.length;

  if (charCount > 5000) {
    return res.status(400).json({
      error: 'Context is too long (max 5000 characters).',
      charCount,
    });
  }

  res.json({ valid: true, wordCount, charCount });
});

module.exports = router;
