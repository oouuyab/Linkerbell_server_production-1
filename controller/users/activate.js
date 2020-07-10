const { users } = require('../../models');
const jwt = require('jsonwebtoken');

module.exports = {
  patch: (req, res) => {
    let check_token = jwt.verify(req.params.token, process.env.JWTSECRETKEY);
    if (!check_token) {
      return res.status(401).send('check_token');
    }
    users
      .findOne({
        where: {
          email_token: req.params.token,
        },
      })
      .then((result) => {
        if (result === null) {
          return res.status(403).send('이미 인증되었습니다.');
        }
        users
          .update(
            {
              activate: 1,
              email_token: null,
            },
            {
              where: {
                id: result.id,
              },
            }
          )
          .then((result) => {
            res.status(200).send('이메일 인증이 완료되었습니다.');
          })
          .catch((err) => {
            res.status(400).send('bad request');
          });
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
};
