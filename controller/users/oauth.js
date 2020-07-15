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
          let id;
          const email = payload.email;

          const findEmail = await users.findOne({ where: { email: email } });
          let token = '';
          if (findEmail === null) {
            token = await addOauthToken(payload);
            id = token.id;
          } else {
            token = await updateToken(payload);
            id = findEmail.dataValues.id;
          }
          return res.status(200).cookie('token', token).json({
            user_id: id,
            token: token,
            isOauth: 1,
            autoLogin: 0,
          });
        } catch (err) {
          console.log('oauth verify err');
          console.log(err);
          res.status(400).send('bad request');
        }
      };
      verify();
    } catch (err) {
      console.log('oauth err');
      console.log(err);
      res.status(404).send('bad request');
    }
  },
};
