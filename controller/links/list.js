const { urls } = require('../../models');
const extract = require('meta-extractor');

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
          const list = await Promise.all(
            result.map(async (re) => {
              var obj = {};
              const ext = await extract({ uri: re.url });
              const og = {
                og_title: ext.ogTitle || ext.title,
                og_image: ext.ogImage || ext.twitterImage,
                og_description:
                  ext.ogDescription ||
                  ext.description ||
                  ext.twitterDescription,
              };
              const data = { ...re.dataValues, ...og };
              obj = { ...obj, ...data };
              return obj;
            })
          );
          res.status(200).json(list);
        } else {
          res.status(400).send('bad request');
        }
      });
  },
};
