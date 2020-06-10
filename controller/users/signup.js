const { users } = require('../../models');

module.exports = {
  post: (req, res) => {
    const { email, password, age, gender } = req.body;
    users
      .findOrCreate({
        where: {
          email: email,
        },
        defaults: {
          password: password,
          age: age,
          gender: gender,
        },
      })
      .then(async ([user, created]) => {
        if (!created) {
          return res.status(409).send('이미 존재하는 이메일주소 입니다.');
        }
        const data = await user.get({ plain: true });
        res.status(201).json(data);
      });
  },
};
