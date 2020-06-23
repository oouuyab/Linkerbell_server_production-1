const { users } = require('../../models');
const { checkToken } = require('../../modules');
const bcrypt = require('bcryptjs');

module.exports = {
  patch: (req, res) => {
    // 세션 , 토큰 검증
    console.log(req.cookies.session_id);
    if (req.cookies.session_id) {
      if (!req.cookies.token) {
        res.status(404).end('로그인 해주세요!');
      }
      console.log(req.cookies.token);
      const token_info = checkToken(req);

      console.log(token_info);
      const id = token_info.user_id;
      const { password, newPassword } = req.body;
      console.log(password, newPassword);

      users.findOne({ where: { id: id } }).then(async (result) => {
        if (result === null) {
          res.status(401).send('회원 정보가 없습니다.');
        }
        if (result.password) {
          if (bcrypt.compareSync(password, result.password)) {
            var salt = bcrypt.genSaltSync(10);
            const hash = await bcrypt.hash(newPassword, salt);
            console.log(hash);
            users.update({ password: hash }, { where: { id: id } });
            res.status(200).send('비밀번호 변경 완료');
          } else {
            res.status(401).send('비밀번호가 맞지 않습니다.');
          }
        }
      });
    } else {
      res.status(404).end('로그인 해주세요!');
    }
  },
};