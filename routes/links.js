const express = require('express')
const router = express.Router()

const { linksController } = require('../controller')

// router.get('/home', linksController.home.get)
router.post('/:user_id', linksController.add_links.post)

module.exports = router
