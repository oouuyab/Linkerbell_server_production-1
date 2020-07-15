const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { users } = require('../../models');
const entoken = require('./enToken');

let updateToken = async (payload) => {
  const { sub, email } = payload;

  const findEmail = await users.findOne({ where: { email: email } });

  let userInfo = { user_id: findEmail.dataValues.id, email, sub, isOauth: 1 }; //사용자 정보
  let options = { expiresIn: '7d', issuer: 'Linkerbell' };
  let encodedUserInfo = { token: entoken(userInfo) };
  userInfo.token = jwt.sign(encodedUserInfo, process.env.JWTSECRETKEY, options);
  return userInfo.token;
};
module.exports = updateToken;
