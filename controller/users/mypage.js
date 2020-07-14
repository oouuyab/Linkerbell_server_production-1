const { users } = require('../../models');
const { checkToken } = require('../../modules');
const bcrypt = require('bcryptjs');

module.exports = {
  patch: (req, res) => {
    // 세션 , 토큰 검증
    if (!req.cookies.token) {
      res.status(404).end('please_signin');
    }
    const token_info = checkToken(req);

    const id = token_info.user_id;
    const { password, newPassword, checkPassword } = req.body;
    if (newPassword !== checkPassword) {
      return res.status(403).send('check_newPW');
    }

    users.findOne({ where: { id: id } }).then(async (result) => {
      if (result === null) {
        res.status(401).send('please_signin');
      }
      if (result.password) {
        if (bcrypt.compareSync(password, result.password)) {
          var salt = bcrypt.genSaltSync(10);
          const hash = await bcrypt.hash(newPassword, salt);
          users.update({ password: hash, activate: 1 }, { where: { id: id } });
          res.status(200).send('비밀번호 변경 완료');
        } else {
          res.status(401).send('check_pw');
        }
      }
    });
  },
  delete: (req, res) => {
    try {
      if (!req.cookies.token) {
        res.status(404).end('please_signin');
      }
      console.log(req.cookies.token);
      const token_info = checkToken(req);

      console.log(token_info);
      const user_id = token_info.user_id;

      users.destroy({ where: { id: user_id } }).then((result) => {
        if (!result) {
          res.status(400).send('bad request');
        }
        res.status(200).send('삭제되었습니다.');
      });
    } catch (err) {
      console.log('delete user err');
      console.log(err);
      res.status(400).send('bad request');
    }
  },
};
