const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

let addToken = (result) => {
  console.log(result);
  const { id, email } = result;
  let userInfo = { user_id: id, email: email }; //사용자 정보
  let options = { expiresIn: '7d', issuer: 'Linkerbell', subject: 'userInfo' };

  userInfo.token = jwt.sign(userInfo, process.env.JWTSECRETKEY, options);
  return userInfo.token;
};
module.exports = addToken;
