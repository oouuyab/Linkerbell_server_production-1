const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const checkToken = (req, res) => {
  try {
    const token_info = jwt.verify(
      req.cookies.token,
      process.env.JWTSECRETKEY,
      (error, decoded) => {
        if (error) {
          return error;
        } else {
          return decoded;
        }
      }
    );
    const key = process.env.CRYPTOSECRETKEY;
    let textParts = token_info.token.split(':');
    let cipherText = Buffer.from(textParts.shift(), 'hex');
    let tag = Buffer.from(textParts.shift(), 'hex');
    let nonce = Buffer.from(textParts.shift(), 'hex');
    let aad = Buffer.from(textParts.join(':'), 'hex');

    const decipher = crypto.createDecipheriv('aes-128-ccm', key, nonce, {
      authTagLength: 16,
    });

    decipher.setAuthTag(tag);
    decipher.setAAD(aad, { plaintextLength: cipherText.length });

    let recievedPlaintext = decipher.update(cipherText, 'hex', 'utf8');
    recievedPlaintext += decipher.final('utf8');

    return JSON.parse(recievedPlaintext);
  } catch (err) {
    console.log('checkToken err');
    console.log(err);
    return;
  }
};
module.exports = checkToken;
