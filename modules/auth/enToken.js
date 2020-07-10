const crypto = require('crypto');
const env = require('dotenv').config();

const enToken = (user_info) => {
  const key = process.env.CRYPTOSECRETKEY;

  const nonce = crypto.randomBytes(parseInt(process.env.IV_LENGTH));
  const aad = Buffer.from(key, 'hex');

  let cipher = crypto.createCipheriv('aes-128-ccm', key, nonce, {
    authTagLength: 16,
  });

  let stringifyData = JSON.stringify(user_info);

  let crypted = cipher.update(stringifyData, 'utf8', 'hex');
  crypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return `${crypted.toString('hex')}:${tag.toString('hex')}:${nonce.toString(
    'hex'
  )}:${aad.toString('hex')}`;
};

module.exports = enToken;
