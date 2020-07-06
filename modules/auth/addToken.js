const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

let addToken = (result) => {
  console.log(result);
  const { id, email } = result;
  let isOauth;
  if (result.isOauth === 1) {
    isOauth = result.isOauth;
  } else {
    isOauth = 0;
  }
  let userInfo = { user_id: id, email: email, isOauth: isOauth }; //사용자 정보
  let options = { expiresIn: '7d', issuer: 'Linkerbell', subject: 'userInfo' };

  userInfo.token = jwt.sign(userInfo, process.env.JWTSECRETKEY, options);
  return userInfo.token;
};
module.exports = addToken;
