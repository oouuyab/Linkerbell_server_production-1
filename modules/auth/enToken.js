// const crypto = require('crypto');
// const env = require('dotenv').config();

// const enToken = async (user_info) => {
//   const hashed = await crypto.createHmac('sha512', process.env.CRYPTOSECRETKEY);
//   const updated = await hashed.update(user_info.token);
//   const token = await updated.digest('hex');
//   console.log(token);
//   return token;
// };

// module.exports = enToken
