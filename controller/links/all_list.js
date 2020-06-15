const { urls, url_tag } = require('../../models');
const { checkToken } = require('../../modules');
const utils = require('../../modules/og');

module.exports = {
  get: async (req, res) => {
    try {
      const token_info = checkToken(req);
      const { user_id } = token_info;
      const findUrls = await urls.findAll({
        where: {
          user_id: user_id,
        },
      });
      const getList = await utils.getListData(findUrls);
      console.log(getList);
      const unflatted = await Promise.all(
        findUrls.map(async (list) => {
          const url_id = list.dataValues.id;
          const isold = await urls.update(
            { isnew: 0 },
            { where: { id: url_id } }
          );
          const tagList = await url_tag.findAll({ where: { url_id: url_id } });
          const tags = await tagList.map((list) => list.dataValues.tag_name);
          return tags;
        })
      );
      const flattedList = unflatted.flat();
      res.status(200).json({ lists: getList, tag_list: flattedList });
    } catch (err) {
      res.status(400).end('bad request');
    }
  },
};
