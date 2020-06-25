const { users } = require('../../models');
const { addToken, checkToken, enToken } = require('../../modules');
const bcrypt = require('bcryptjs');

module.exports = {
  post: (req, res) => {
    //* 자동 로그인
    if (Object.keys(req.body).length === 0) {
      if (req.cookies.session_id) {
        if (!req.cookies.token) {
          res.status(404).end('please_signin');
        }
        console.log(req.cookies.token);
        const token_info = checkToken(req);
        console.log(token_info);
        const { user_id, email, isOauth } = token_info;
        //const token = enToken(req.cookies);
        res.status(200).json({
          user_id: user_id,
          email: email,
          token: req.cookies.token,
          isOauth: isOauth,
        });
      } else if (!req.cookies.session_id) {
        res.status(404).end('please_signin');
      } else {
        res.status(404).end();
      }
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
              const user_info = addToken(result.dataValues);
              //const token = enToken(user_info);
              req.session.id = result.dataValues.id;
              console.log(user_info);
              res
                .status(200)
                .cookie('session_id', req.session.id)
                .cookie('token', user_info)
                .json({
                  user_id: result.dataValues.id,
                  email: result.dataValues.email,
                  token: user_info,
                  isOauth: 0,
                })
                .end();
            } else {
              res.status(401).send('check_pw');
            }
          }
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    }
  },
};
