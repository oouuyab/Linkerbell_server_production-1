const { users } = require('../../models');
const { addToken, checkToken, enToken } = require('../../modules');

module.exports = {
  post: (req, res) => {
    const { email } = req.body;
    const password = String(Math.floor(Math.random() * 100000000));
    console.log(password);
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
        if (created) {
          //? 처음 가입 -> 바로 로그인 처리
          const data = await user.get({ plain: true });
          const user_info = addToken(data);
          req.session.id = data.id;
          res
            .status(200)
            .cookie('session_id', req.session.id)
            .cookie('token', user_info.token)
            .json({
              user_id: data.id,
            });
        } else {
          //? 이미 가입
          const user_info = addToken(user.dataValues);
          req.session.id = user.dataValues.id;
          res
            .status(201)
            .cookie('session_id', req.session.id)
            .cookie('token', user_info.token)
            .json({
              user_id: user.dataValues.id,
            });
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
};
