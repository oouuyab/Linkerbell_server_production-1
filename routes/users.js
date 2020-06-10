const express = require('express');
const router = express.Router();

const { usersController } = require('../controller');

router.post('/signin', usersController.signin.post);

router.post('/signout', usersController.signout.post);

router.post('/signup', usersController.signup.post);

router.put('/profile/:user_id', usersController.profile.put);

router.post('/oauth', usersController.oauth.post);

module.exports = router;
