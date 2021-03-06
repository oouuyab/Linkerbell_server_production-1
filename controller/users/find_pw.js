const { users } = require('../../models');
const sendEmail = require('../../modules/sendEmail');
const bcrypt = require('bcryptjs');

module.exports = {
  post: (req, res) => {
    const { email } = req.body;
    users.findOne({ where: { email: email } }).then(async (result) => {
      if (result === null) {
        return res.status(401).send('check_email');
      }
      let temp_pw = Math.random().toString(36).slice(2);
      let salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(temp_pw, salt);
      let new_pw = hash;
      await users
        .update(
          {
            password: new_pw,
            activate: 2,
          },
          {
            where: {
              email: email,
            },
          }
        )
        .then((result) => {
          console.log(result);
          sendEmail.sendResetPasswordMail({
            email: email,
            temp_pw: temp_pw,
          });
          res.status(201).send('send email');
        })
        .catch((err) => {
          res.status(400).send('bad request');
        });
    });
  },
};
