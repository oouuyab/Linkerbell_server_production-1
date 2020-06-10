const express = require('express');
const router = express.Router();

const { linksController } = require('../controller');

router.post('/links', function () {
  console.log('hello world');
});

module.exports = router;
