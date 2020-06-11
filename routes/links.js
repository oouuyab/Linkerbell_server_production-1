const express = require('express');
const router = express.Router();

const { linksController } = require('../controller');

router.get('/list/:user_id', linksController.list.get);
router.post('/:user_id', linksController.add_links.post);

module.exports = router;
