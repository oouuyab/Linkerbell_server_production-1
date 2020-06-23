const { urls } = require('../../models');
const { classifier } = require('../../modules');
const { checkToken } = require('../../modules');
const { FB } = require('fb');

var cheerio = require('cheerio');
var request = require('request');
var puppeteer = require('puppeteer');
const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-title')(),
]);
const got = require('got');
const iconv = require('iconv-lite');
const charset = require('charset');

module.exports = {
  post: async (req, res) => {
    try {
      const token_info = checkToken(req);
      const { user_id } = token_info;
      const category = async function () {
        return classifier(req.body.url);
      };
      const { result, analysis } = await category();
      //페이스북 그래프 API 탐색기
      const facebook = async () => {
        await FB.api(
          '',
          'POST',
          {
            scrape: 'true',
            id: req.body.url,
            access_token: process.env.FB_OG_API_TOKEN,
          },
          function (fb) {
            let img;
            fb.image ? (img = fb.image[0].url) : (img = '');
            var og = {
              og_title: fb.title || req.body.url,
              og_image: img || '',
              og_description: fb.description || '',
            };
            console.log('fb og', og);
            send_og(og);
          }
        );
      };
      //////////////fb end///////////////////////////////////////////////////////////////
      //////////////////////////////iframe//////////body//////////////////////////////////////
      const iframeUrl = async (url) => {
        console.time('aa');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const urls = await page.$$eval('iframe', (el) =>
          [].map.call(el, (d) => d.src)
        );
        await browser.close();

        const i_url = urls[0];
        console.log('iframe_url', i_url);
        req_og(i_url);
        console.timeEnd('aa');
      };

      if (req.body.url.includes('https://blog.naver.com')) {
        await iframeUrl(req.body.url);
        // } else if (req.body.url.includes('https://dict.naver.com/#/')) {
        //   const dict_url = req.body.url.replace('#', 'ko');
        //   req_og(dict_url);
      } else if (req.body.url.includes('https://cafe.naver')) {
        await naver_cafe();
      } else {
        await req_og(req.body.url);
      }

      ///////////////////////iframe end///////////////////////////
      function req_og(url) {
        request({ url: url, encoding: null, followRedirect: true }, function (
          error,
          response,
          body
        ) {
          if (!error && response.statusCode == 200) {
            const encode = charset(response.headers, body);
            //console.log(enc);
            const decode = iconv.decode(body, encode);
            var $ = cheerio.load(decode);
            // var title1 = $('head > title').text();
            // if (req.body.url) console.log('head title:', title1);
            let head = $('body')[0].children;
            let title = '';
            var meta = $('meta');
            var keys = Object.keys(meta);
            var ogImage;
            var ogDesc;
            var ogTitle;

            keys.forEach(function (key) {
              if (
                meta[key].attribs &&
                meta[key].attribs.property &&
                meta[key].attribs.property === 'og:image'
              ) {
                ogImage = meta[key].attribs.content || '';
              }
            });

            keys.forEach(function (key) {
              if (
                meta[key].attribs &&
                meta[key].attribs.property &&
                meta[key].attribs.property === 'og:description'
              ) {
                ogDesc = meta[key].attribs.content || '';
              }
            });

            keys.forEach(function (key) {
              if (
                meta[key].attribs &&
                meta[key].attribs.property &&
                meta[key].attribs.property === 'og:title'
              ) {
                ogTitle = meta[key].attribs.content || '';
              }
            });
            if (!ogTitle || !ogImage) {
              metascrap(req.body.url);
            } else {
              var og = {
                og_title: ogTitle || req.body.url,
                og_image: ogImage || '',
                og_description: ogDesc || '',
              };
              console.log('req\n og_ : ', og, '\n=================');
              send_og(og);
            }
          }
        });
      }
      ////////////////metascraper/////////////////////////////////////////
      const naver_cafe = () => {
        let arr = [];
        const m = got
          .stream(req.body.url)
          .setEncoding('binary')
          .on('data', async (data) => {
            const dec = await iconv.decode(data, 'cp949');
            const meta = await metascraper({ html: dec, url: req.body.url });
            await arr.push(meta);
            var og = {
              og_title: arr[0].title,
              og_image:
                'https://cafe.pstatic.net/mobile/img/favicon2016/android_144x144_xxhpdi.png',
            };
            console.log(og);
            send_og(og);
          });
      };

      async function metascrap(my_url) {
        const { body: html, url } = await got(my_url);
        const metadata = await metascraper({ html, url });
        if (metadata.title === null || metadata.image === null) {
          facebook();
        } else {
          console.log('my_url metascraper:', metadata);
          var og = {
            og_title: metadata.title || req.body.url,
            og_image: metadata.image || '',
            og_description: metadata.description || '',
          };
          send_og(og);
        }
      }
      ////////////////metascraper end/////////////////////////////////////////

      const send_og = (og) => {
        const edit_t = og.og_title.replace(/(^\s*)|(\s*$)|\n|\t|\r/g, '');
        const edit_d = og.og_description.replace(/(^\s*)|(\s*$)|\n|\t|\r/g, '');
        (og.og_title = edit_t), (og.og_description = edit_d);
        urls
          .findOrCreate({
            where: {
              user_id: user_id,
              url: req.body.url,
            },
            defaults: {
              category_id: result,
              og_title: og.og_title || '',
              og_image: og.og_image || '',
              og_description: og.og_description || '',
            },
          })
          .then(async ([url, created]) => {
            if (!created) {
              return res.status(409).send('이미 존재하는 url입니다.');
            }
            const data = await url.get({ plain: true });
            res.status(201).send({ ...data, analysis: analysis });
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
