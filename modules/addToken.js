const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

let addToken = (result) => {
  const { id } = result.dataValues;
  let userInfo = { user_id: id }; //사용자 정보
  let options = { expiresIn: "7d", issuer: "Linkerbell", subject: "userInfo" };

  userInfo.token = jwt.sign(userInfo, process.env.JWTSECRETKEY, options);
  return userInfo;
};
module.exports = addToken;
