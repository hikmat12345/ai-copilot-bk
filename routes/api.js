const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
  res.json([{ name: 'John', email: 'john@example.com' }]);
});

module.exports = router;