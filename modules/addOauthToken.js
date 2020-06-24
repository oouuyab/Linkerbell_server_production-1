const { users } = require('../models');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

let addOauthToken = async (payload) => {
  const { sub, email } = payload;

  const createUser = await users.create({ email: email, password: sub });
  console.log(createUser);
  let userInfo = { id: createUser.dataValues.id, email, sub, isOauth: 1 }; //사용자 정보
  let options = { expiresIn: '7d', issuer: 'Linkerbell', subject: 'sub' };

  userInfo.token = jwt.sign(userInfo, process.env.JWTSECRETKEY, options);
  return userInfo;
};
module.exports = addOauthToken;
