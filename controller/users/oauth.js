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

        return res.status(203).cookie('token', token).json(token);
      };
      verify();
    } catch {
      res.status(400).send('oauth 실패');
    }
  },
};
