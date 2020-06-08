const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

export const checkToken = (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWTSECRETKEY, (error, decoded) => {});
};
