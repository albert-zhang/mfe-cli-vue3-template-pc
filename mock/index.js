const express = require('express');
const router = express.Router();

router.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'AUTH-TOKEN, TOKEN, Content-Type, BUSINESS-DOMAIN');
  res.end();
})

router.get('/api/example', (req, res) => res.json(require('./data/example')));

module.exports = router;
