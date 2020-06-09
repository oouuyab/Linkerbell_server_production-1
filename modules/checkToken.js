const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const checkToken = (req, res) => {
  //const decode = createCipher(req.coockies.token,process.env.CRYPTOSECRETKEY);
  //const decodeResult = decode.update()
  const token_info = jwt.verify(req.cookies.token, process.env.JWTSECRETKEY, (error, decoded) => {
    if (error) {
      return error;
    } else {
      return token;
    }
  });

  return token_info;
};
module.exports = checkToken;
