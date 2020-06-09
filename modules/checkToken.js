const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const checkToken = (req, res) => {
  const token_info = req.cookies.token;
  jwt.verify(token, process.env.JWTSECRETKEY, (error, decoded) => {
    if (err) {
      return res.sendStatus(403);
    } else {
      return token;
    }
  });
  return token_info;
};
module.exports = checkToken;
