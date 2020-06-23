const express = require('express');
const router = express.Router();

const { usersController } = require('../controller');

router.post('/signin', usersController.signin.post);

router.post('/signout', usersController.signout.post);

router.post('/signup', usersController.signup.post);

router.patch('/profile', usersController.profile.patch);

router.patch('/mypage', usersController.mypage.patch);

router.post('/oauth', usersController.oauth.post);

router.post('/oauth_1', usersController.oauth_1.post);

module.exports = router;
