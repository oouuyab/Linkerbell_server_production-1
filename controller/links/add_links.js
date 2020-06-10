const { urls } = require('../../models');

module.exports = {
  post: (req, res) => {
    urls
      .findOrCreate({
        where: {
          user_id: req.params.user_id,
          url: req.body.url,
        },
      })
      .then(async ([url, created]) => {
        if (!created) {
          return res.status(409).send('이미 존재하는 url입니다.');
        }
        const data = await url.get({ plain: true });
        res.status(201).json(data);
      });
  },
};
