const { users } = require('../../models');
const { addToken, checkToken, enToken } = require('../../modules');
const bcrypt = require('bcryptjs');

module.exports = {
  post: (req, res) => {
    //* 자동 로그인
    if (Object.keys(req.body).length === 0) {
      if (!req.cookies.token) {
        res.status(404).end('please_signin');
      }
      const token_info = checkToken(req);
      const { user_id, email, isOauth } = token_info;
      res.status(200).json({
        user_id: user_id,
        email: email,
        token: req.cookies.token,
        isOauth: isOauth,
        autoLogin: 1,
      });
    } else {
      //* 일반 로그인
      const { email, password } = req.body;
      users
        .findOne({
          where: {
            email: email,
          },
        })
        .then((result) => {
          if (result === null) {
            res.status(401).send('check_email');
          }
          if (result.password) {
            if (bcrypt.compareSync(password, result.password)) {
              if (result.activate === 0) {
                return res.status(401).send('이메일 인증을 완료해 주세요');
              }
              const user_info = addToken(result.dataValues);
              res
                .status(200)
                .cookie('token', user_info)
                .json({
                  user_id: result.dataValues.id,
                  email: result.dataValues.email,
                  token: user_info,
                  isOauth: 0,
                  autoLogin: 0,
                })
                .end();
            } else {
              res.status(401).send('check_pw');
            }
          }
        })
        .catch((err) => {
          console.log('signin err');
          console.log(err);
          res.status(404).send('bad requrest');
        });
    }
  },
};
