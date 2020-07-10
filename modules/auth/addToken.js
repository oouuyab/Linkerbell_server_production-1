const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const entoken = require('./entoken');
let addToken = (result) => {
  const { id, email } = result;
  let isOauth;
  if (result.isOauth === 1) {
    isOauth = result.isOauth;
  } else {
    isOauth = 0;
  }
  let userInfo = { user_id: id, email: email, isOauth: isOauth };
  let options = { expiresIn: '7d', issuer: 'Linkerbell', subject: 'userInfo' };
  let encodedUserInfo = { token: entoken(userInfo) };
  userInfo.token = jwt.sign(encodedUserInfo, process.env.JWTSECRETKEY, options);
  return userInfo.token;
};
module.exports = addToken;
