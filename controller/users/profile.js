const { users } = require('../../models');

module.exports = {
  patch: (req, res) => {
    const { age, gender, user_id } = req.body;
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
