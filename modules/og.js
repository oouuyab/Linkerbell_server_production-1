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

exports.getOgData = async (data_url, cb) => {
  console.time('og.js');
  let og = {};
  let fixed_url = '';
  console.log('getogdata');
  try {
    //페이스북 그래프 API 탐색기
    const facebook = async (fb_url) => {
      await FB.api(
        '',
        'POST',
        {
          scrape: 'true',
          id: fb_url,
          access_token: process.env.FB_OG_API_TOKEN,
        },
        function (fb) {
          if (!fb) {
            var no_og = { og_title: data_url };
            return cb('fb api connection error', no_og);
          }
          let img;
          fb.image ? (img = fb.image[0].url) : (img = '');
          var fb_og = {
            og_title: fb.title || data_url,
            og_image: img || '',
            og_description: fb.description || '',
          };
          og = fb_og;
          console.log('fb og->og', og);
          return cb('', og);
        }
      );
    };
    //////////////fb end///////////////////////////////////////////////////////////////
    //////////////////////////////iframe//////////body//////////////////////////////////////
    const iframeUrl = async (url) => {
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
    };

    ///////////////////////iframe end///////////////////////////
    function req_og(re_url) {
      request(
        {
          url: re_url,
          encoding: null,
          followRedirect: true,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36 OPR/60.0.3255.170',
          },
        },
        async function (error, response, body) {
          if (!error && response.statusCode == 200) {
            const encode = charset(response.headers, body);
            if (!encode) {
              metascrap(data_url);
            }
            const decode = iconv.decode(body, encode);
            var $ = await cheerio.load(decode);
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
              metascrap(data_url);
            } else {
              var r_og = {
                og_title: ogTitle || data_url,
                og_image: ogImage || '',
                og_description: ogDesc || '',
              };
              og = r_og;
              console.log('req og->og', og);
              return cb(error, og);
            }
          } else {
            var no_og = { og_title: data_url };
            return cb('req og error', no_og);
          }
        }
      );
    }
    ////////////////metascraper/////////////////////////////////////////
    async function metascrap(my_url) {
      try {
        const { body: html, url } = await got(my_url);
        const metadata = await metascraper({ html, url });
        if (!metadata || metadata.title === null || metadata.image === null) {
          facebook(data_url);
        } else {
          var meta_og = {
            og_title: metadata.title || data_url,
            og_image: metadata.image || '',
            og_description: metadata.description || '',
          };
          og = meta_og;
          console.log('meta og->og', og);
          return cb('', og);
        }
      } catch (err) {
        console.log('og.js error');
        var no_og = { og_title: data_url };
        return cb(err, no_og);
      }
    }
    ////////////////metascraper end/////////////////////////////////////////

    if (data_url.includes('https://blog.naver.com')) {
      iframeUrl(data_url);
    } else if (data_url.includes('cafe.daum.net')) {
      if (!data_url.includes('?svc=') && !data_url.includes('?q=')) {
        og = {
          og_title: 'Daum 카페',
          og_image:
            'https://t1.daumcdn.net/cafe_image/cafe_meta_image_190529.png',
          og_description: '',
        };
        return cb('', og);
      } else {
        facebook(data_url);
      }
    } else if (data_url.includes('dict.naver.com/#/')) {
      fixed_url = data_url.replace(/#/, 'ko');
      facebook(fixed_url);
    } else if (
      data_url.includes('book.interpark') ||
      data_url.includes('https://cafe.naver.com')
    ) {
      facebook(data_url);
    } else if (data_url.includes('smartstore.naver')) {
      const parameter = data_url.indexOf('?');
      fixed_url = data_url.slice(0, parameter);
      facebook(fixed_url);
    } else if (data_url.includes('coupang.com')) {
      og = {
        og_title: '쿠팡',
        og_image: 'https://img1a.coupangcdn.com/image/mobile/v3/logo.png',
        og_description: '',
      };
      return cb('', og);
    } else {
      req_og(data_url);
    }
  } catch (err) {
    console.log('og.js error');
    var no_og = { og_title: data_url };
    return cb(err, no_og);
  }
  console.timeEnd('og.js');
};
