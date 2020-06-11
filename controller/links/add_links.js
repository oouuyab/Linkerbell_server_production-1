const { urls } = require('../../models');
const { classifier } = require('../../modules');

module.exports = {
  post: async (req, res) => {
    const category = async function () {
      return classifier(req.body.url);
    };
    const result = await category();
    urls
      .findOrCreate({
        where: {
          user_id: req.params.user_id,
          url: req.body.url,
        },
        defaults: {
          category_id: result,
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
