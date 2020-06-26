const xss = require('xss');
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
        return res.status(403).send('please_signin');
      }
      const { url } = req.body;
      // xss
      var rurl = xss(url);
      // 한글 입력시 url 인코딩
      var enc_url = encodeURI(rurl);
      //* 카테고리 분석
      console.time('카테고리 분석');
      const category = () => classifier(req.body.url);
      const { result, analysis } = await category();
      console.timeEnd('카테고리 분석');
      //* og 분석
      console.time('ogt');
      const ogt = await og.getOgData(enc_url, (err, ogt) => {
        send_og(ogt);
      });
      console.timeEnd('ogt');
      function send_og(og) {
        console.time('send_og');
        !og.og_title ? (og.og_title = enc_url) : console.log('title exist');
        if (url.length > 40) {
          const parameter = enc_url.indexOf('?');
          var short_url = enc_url.slice(0, parameter);
          if (og.og_title === enc_url) {
            og.og_title = short_url;
          }
        }
        const edit_t = og.og_title.replace(/(^\s*)|(\s*$)|\n|\t|\r/g, '');
        og.og_title = edit_t;
        if (og.og_description) {
          const edit_d = og.og_description
            .replace(/(^\s*)|(\s*$)|\n|\t|\r/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&#39;/g, "'");
          og.og_description = edit_d;
        }
        //* DB
        urls
          .findOrCreate({
            where: {
              user_id: user_id,
              url: enc_url,
            },
            defaults: {
              category_id: result,
              og_title: og.og_title || enc_url,
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
        console.timeEnd('send_og');
      }
      console.timeEnd('og');
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
