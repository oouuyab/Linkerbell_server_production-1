const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

export let addToken = (req) => {
  const { id } = req.body;
  let userInfo = { user_id: id }; //사용자 정보
  let options = { expiresIn: "7d", issuer: "Linkerbell", subject: "userInfo" };

  userInfo.token = jwt.sign(userInfo, process.env.JWTSECRETKEY, options, (err, token) => {
    if (err) console.log(err);
    else console.log(token);
  });
  return userInfo;
};
module.exports = addToken;
