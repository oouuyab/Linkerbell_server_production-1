const express = require('express')
const router = express.Router()

const { usersController } = require('../controller')

router.post('/signin', usersController.signin.post)

router.post('/signout', usersController.signout.post)

router.post('/signup', usersController.signup.post)

module.exports = router
