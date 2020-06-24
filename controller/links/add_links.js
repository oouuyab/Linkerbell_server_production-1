const { urls } = require('../../models');
const og = require('../../modules/og');
const { classifier } = require('../../modules');
const { checkToken } = require('../../modules');

module.exports = {
  post: async (req, res) => {
    try {
      const token_info = checkToken(req);
      const { user_id } = token_info;
      if (user_id === undefined) {
        return res.status(403).send('로그인을 해주세요');
      }
      //* 카테고리 분석
      console.time('카테고리 분석');
      const category = () => classifier(req.body.url);
      const { result, analysis } = await category();
      console.timeEnd('카테고리 분석');
      //* og 분석
      const ogt = await og.getOgData(req.body.url, (err, ogt) => {
        send_og(ogt);
      });
      const send_og = async (og) => {
        !og.og_title
          ? (og.og_title = req.body.url)
          : console.log('title exist');
        const edit_t = og.og_title.replace(/\n|\t|\r/g, '');
        og.og_title = edit_t;
        if (og.og_description) {
          const edit_d = og.og_description.replace(/\n|\t|\r/g, '');
          og.og_description = edit_d;
        }

        //* DB
        await urls
          .findOrCreate({
            where: {
              user_id: user_id,
              url: req.body.url,
            },
            defaults: {
              category_id: result,
              og_title: og.og_title,
              og_image: og.og_image || '',
              og_description: og.og_description || '',
            },
          })
          .then(async ([url, created]) => {
            if (!created) {
              return res.status(409).send('이미 존재하는 url입니다.');
            } else {
              const data = await url.get({ plain: true });
              res
                .status(201)
                .send({ link_data: { ...data }, analysis: analysis });
            }
          });
      };
    } catch (err) {
      return res.status(400).send('bad request');
    }
  },
  delete: (req, res) => {
    try {
      urls
        .destroy({
          where: {
            id: req.params.url_id,
          },
        })
        .then((result) => {
          if (!result) {
            res.status(400).send('bad request');
          }
          res.status(201).send('삭제되었습니다.');
        });
    } catch (err) {
      res.status(400).send('bad request');
    }
  },
};
