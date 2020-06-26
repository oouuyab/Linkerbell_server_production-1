const { users } = require('../../models');
const { Oauth2Client, OAuth2Client } = require('google-auth-library');
const { updateToken, addOauthToken } = require('../../modules');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_KEY);
module.exports = {
  post: async (req, res) => {
    try {
      const { it, at } = req.body;
      const verify = async () => {
        try {
          const ticket = await client.verifyIdToken({
            idToken: it,
          });
          const payload = ticket.getPayload();
          const userid = payload[process.env.GOOGLE_OAUTH_KEY]; //21자리의 google 회원 id 번호

          const email = payload.email;

          const findEmail = await users.findAll({ where: { email: email } });
          let token = '';
          if (findEmail.length === 0) {
            token = await addOauthToken(payload);
            console.log(token);
          } else {
            token = await updateToken(payload);
            console.log(token);
          }

          return res
            .status(200)
            .cookie('token', token)
            .json({ token: token, isOauth: 1, autoLogin: 0 });
        } catch (err) {
          res.status(400).send('please_signin');
        }
      };
      verify();
    } catch {
      res.status(400).send('please_signin');
    }
  },
};
