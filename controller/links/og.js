const extract = require('meta-extractor');

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
      const data = { ...re.dataValues, ...og };
      obj = { ...obj, ...data };
      return obj;
    })
  );
  return list;
};
