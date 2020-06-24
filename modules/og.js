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
  let og = {};
  //페이스북 그래프 API 탐색기
  const facebook = async (f_url) => {
    await FB.api(
      '',
      'POST',
      {
        scrape: 'true',
        id: f_url,
        access_token: process.env.FB_OG_API_TOKEN,
      },
      function (fb) {
        if (!fb) {
          var no_og = { og_title: data_url };
          return cb(err, no_og);
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

  ///////////////////////iframe end///////////////////////////
  function req_og(re_url) {
    request(
      { url: re_url, encoding: null, followRedirect: true },
      async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const encode = charset(response.headers, body);
          const decode = iconv.decode(body, encode);
          var $ = await cheerio.load(decode);
          // var title1 = $('head > title').text();
          // if (data_url) console.log('head title:', title1);
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
            metascrap(data_url);
          } else {
            var r_og = {
              og_title: ogTitle || data_url,
              og_image: ogImage || '',
              og_description: ogDesc || '',
            };
            og = r_og;
            console.log('req og->og', og);
            return cb('', og);
          }
        } else {
          console.log('error');
        }
      }
    );
  }
  ////////////////metascraper/////////////////////////////////////////
  const naver_cafe = (c_url) => {
    let arr = [];
    const m = got
      .stream(c_url)
      .setEncoding('binary')
      .on('data', async (data) => {
        const dec = iconv.decode(data, 'cp949');
        console.log(dec);
        const meta = await metascraper({ html: dec, url: c_url });
        arr.push(meta);
        var cp_og = {
          og_title: arr[0].title || '네이버 카페',
          og_image:
            'https://cafe.pstatic.net/mobile/img/favicon2016/android_144x144_xxhpdi.png',
        };
        og = cp_og;
        console.log('cp og->og', og);
        return cb('', og);
      });
  };

  async function metascrap(my_url) {
    const { body: html, url } = await got(my_url);
    const metadata = await metascraper({ html, url });
    if (metadata.title === null || metadata.image === null) {
      facebook(data_url);
    } else {
      console.log('my_url metascraper:', metadata);
      var meta_og = {
        og_title: metadata.title || data_url,
        og_image: metadata.image || '',
        og_description: metadata.description || '',
      };
      og = meta_og;
      console.log('meta og->og', og);
      return cb('', og);
    }
  }
  ////////////////metascraper end/////////////////////////////////////////

  if (data_url.includes('https://blog.naver.com')) {
    iframeUrl(data_url);
  } else if (data_url.includes('https://cafe.naver.com')) {
    naver_cafe(data_url);
  } else {
    req_og(data_url);
  }
};
