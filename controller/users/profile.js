const { users } = require('../../models');
const { checkToken } = require('../../modules');
module.exports = {
  patch: (req, res) => {
    const token_info = checkToken(req);
    const { user_id } = token_info;
    const { age, gender } = req.body;
    users
      .update(
        {
          age: age,
          gender: gender,
        },
        {
          where: {
            id: user_id,
          },
        }
      )
      .then((result) => {
        res.status(200).send('프로필 설정 완료');
      });
  },
};
