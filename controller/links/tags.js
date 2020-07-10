const { url_tag } = require('../../models');

module.exports = {
  patch: async (req, res) => {
    try {
      const { url_id, tag_list } = req.body;

      //* 기존 태그 다 지우기
      const findTag = await url_tag.findAll({ where: { url_id: url_id } });
      if (findTag.length > 0) {
        const delTag = await url_tag.destroy({ where: { url_id: url_id } });
      }

      //* 받은 태그 다시 만들기
      tag_list.forEach(async (el) => {
        let addTag = await url_tag.create({
          url_id: url_id,
          tag_name: el,
        });
      });

      res.status(200).send('ok');
    } catch (err) {
      console.log('tags err');
      console.log(err);
      res.status(404);
    }
  },
};
