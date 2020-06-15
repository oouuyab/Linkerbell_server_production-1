const { urls, url_tag } = require('../../models');
const { checkToken } = require('../../modules');
const utils = require('../../modules/og');

module.exports = {
  get: async (req, res) => {
    try {
      const token_info = checkToken(req);
      const { user_id } = token_info;
      const category_id = req.params.category_id;

      const findUrls = await urls.findAll({
        where: {
          user_id: user_id,
          category_id: category_id,
        },
      });
      const getList = await utils.getListData(findUrls);
      const unflatted = await Promise.all(
        findUrls.map(async (list) => {
          const url_id = list.dataValues.id;
          const tagList = await url_tag.findAll({ where: { url_id: url_id } });
          const tags = await tagList.map((list) => list.dataValues.tag_name);
          return tags;
        })
      );
      const flattedList = unflatted.flat();
      res.status(200).json({ lists: getList, tag_list: flattedList });
    } catch (err) {
      console.log(err);
      res.status(400).end('bad request');
    }
  },
  patch: (req, res) => {
    const { category_id, url_id } = req.body;
    urls
      .update(
        {
          category_id: category_id,
        },
        {
          where: {
            id: url_id,
          },
        }
      )
      .then((result) => {
        res.status(200).send('category 수정이 완료되었습니다.');
      })
      .catch((err) => {
        res.status(400).send('bad request');
      });
  },
};
