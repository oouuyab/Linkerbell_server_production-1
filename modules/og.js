const extract = require('meta-extractor');

const { url_tag } = require('../models');

exports.getListData = async (result) => {
  const list = await Promise.all(
    result.map(async (re) => {
      var obj = {};
      const ext = await extract({ uri: re.url });
      const og = {
        og_title: ext.ogTitle || ext.title,
        og_image: ext.ogImage || ext.twitterImage,
        og_description:
          ext.ogDescription || ext.description || ext.twitterDescription,
      };
      const findTags = await url_tag.findAll({ where: { url_id: re.id } });
      const tags = await findTags.map((el) => el.dataValues.tag_name);
      const data = { ...re.dataValues, ...og, tags };
      obj = { ...obj, ...data };
      return obj;
    })
  );
  return list;
};
