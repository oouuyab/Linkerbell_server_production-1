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
      let lists = [];
      const unflatted = await Promise.all(
        findUrls.map(async (list) => {
          const url_id = list.dataValues.id;
          urls.update({ isnew: 0 }, { where: { id: url_id } });
          const tagList = await url_tag.findAll({ where: { url_id: url_id } });
          const tags = await tagList.map((list) => {
            return list.dataValues.tag_name;
          });
          lists.push({ ...list.dataValues, tags: tags });
          return tags;
        })
      );
      const tag_list = [];

      const flatted = unflatted.flat().forEach((tag) => {
        if (tag_list.indexOf(tag) === -1) {
          tag_list.push(tag);
        }
      });
      res.status(200).json({ lists: lists, tag_list: tag_list });
    } catch (err) {
      console.log(err);
      res.status(400).end('bad request');
    }
  },
};
