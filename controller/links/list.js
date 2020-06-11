const { urls } = require('../../models');
const utils = require('./og');

module.exports = {
  get: (req, res) => {
    urls
      .findAll({
        where: {
          user_id: req.params.user_id,
        },
      })
      .then(async (result) => {
        if (result) {
          const list = await utils.getListData(result);
          res.status(200).json(list);
        } else {
          res.status(400).send('bad request');
        }
      });
  },
};
