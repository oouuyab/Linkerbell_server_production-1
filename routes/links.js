const express = require('express');
const router = express.Router();

const { linksController } = require('../controller');

router.post('/', linksController.add_links.post);
router.get('/home', linksController.home.get);
router.get('/', linksController.all_list.get);
router.patch('/tags', linksController.tags.patch);
router.get('/category_list/:category_id', linksController.category_list.get);
router.patch('/favorite', linksController.favorite.patch);
module.exports = router;
