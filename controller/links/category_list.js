const { urls, url_tag } = require('../../models');
const { checkToken } = require('../../modules');
const utils = require('../../modules/og');

module.exports = {
  get: async (req, res) => {
    try {
      const token_info = checkToken(req);
      const { user_id } = token_info;
      const category_id = req.params.category_id;
      console.time('all-list');
      const findUrls = await urls.findAll({
        where: {
          user_id: user_id,
          category_id: category_id,
        },
      });
      let lists = [];
      console.time('tag');
      const unflatted = await Promise.all(
        findUrls.map(async (list) => {
          const url_id = list.dataValues.id;
          const tags = await url_tag
            .findAll({ where: { url_id: url_id } })
            .map((list) => list.dataValues.tag_name);
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
      console.timeEnd('tag');
      console.timeEnd('all-list');
      res.status(200).json({ lists: lists, tag_list: tag_list });
      findUrls.forEach((list) => {
        let id = list.dataValues.id;
        urls.update({ isnew: 0 }, { where: { id: id } });
      });
    } catch (err) {
      console.log(err);
      res.status(400).end('bad request');
    }
  },
};
