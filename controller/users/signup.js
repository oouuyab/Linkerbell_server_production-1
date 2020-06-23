const { users } = require('../../models');

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
        await res.status(201).json({ user_id: data.id });
      });
  },
};
