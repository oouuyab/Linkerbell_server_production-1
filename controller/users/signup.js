const { users } = require('../../models');
const sendEmail = require('../../modules/sendEmail');
const jwt = require('jsonwebtoken');

module.exports = {
  post: (req, res) => {
    const { email, password } = req.body;
    users
      .findOrCreate({
        where: {
          email: email,
        },
        defaults: {
          password: password,
        },
      })
      .then(async ([user, created]) => {
        if (!created) {
          return res.status(409).send('이미 존재하는 이메일 주소입니다.');
        }
        const data = user.get({ plain: true });
        let token = jwt.sign(data, process.env.JWTSECRETKEY);
        await users
          .update(
            {
              email_token: token,
            },
            {
              where: {
                id: data.id,
              },
            }
          )
          .then((result) => {
            sendEmail.sendSignupMail({ email: data.email, email_token: token });
            res.status(201).json({ user_id: data.id });
          })
          .catch((err) => {
            res.status(400).send('bad request');
          });
      });
  },
};
