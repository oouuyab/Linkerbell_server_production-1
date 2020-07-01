const axios = require('axios');
const Iconv = require('iconv-lite');
const { FB } = require('fb');
var cheerio = require('cheerio');
var request = require('request');
const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-title')(),
]);
const got = require('got');
const charset = require('charset');

exports.getOgData = async (data_url, cb) => {
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
          console.time('fb api');
          if (!fb) {
            var no_og = { og_title: data_url };
            console.timeEnd('fb api');
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
          console.timeEnd('fb api');
          return cb(null, og);
        }
      );
    };
    //////////////fb end///////////////////////////////////////////////////////////////

    //////////////////////////////iframe//////////body//////////////////////////////////////
    const iframeUrl = async (url) => {
      const getHtml = async () => {
        const opt = {
          method: 'get',
          timeout: 2000,
          maxRedirects: 5,
          responseEncoding: 'binary',
          responseType: 'arraybuffer',
        };
        return await axios.get(url, opt);
      };
      const text = await getHtml().then(async (htmlDoc) => {
        //* 2-1 innerText : html에서 텍스트를 저장하는배열
        let innerText = [];
        //* 2-2 decoding
        const enc = charset(htmlDoc.headers, htmlDoc.data);
        const decodedResult = Iconv.decode(htmlDoc.data, enc);
        const $ = cheerio.load(decodedResult);
        //* 2-3 getText: body tag의 text 가져오기
        //! 분기 : naver Post 인지 판단
        let iframeUrl;
        if (url.indexOf('https://m.blog.naver.com') > -1) {
          console.log('naver blog - mobile');
          iframeUrl = 'https://m.blog.naver.com' + $('iframe').attr('src');
        } else if (url.indexOf('https://blog.naver.com') > -1) {
          console.log('naver blog - mobile');
          iframeUrl = 'https://blog.naver.com' + $('iframe').attr('src');
        }
        console.log(iframeUrl);
        return req_og(iframeUrl);
      });
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
            console.time('req ogt');
            const encode = charset(response.headers, body);
            if (!encode) {
              metascrap(data_url);
            }
            const decode = Iconv.decode(body, encode);
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
              console.timeEnd('req ogt');
              metascrap(data_url);
            } else {
              var r_og = {
                og_title: ogTitle || data_url,
                og_image: ogImage || '',
                og_description: ogDesc || '',
              };
              og = r_og;
              console.log('req og->og', og);
              console.timeEnd('req ogt');
              return cb(error, og);
            }
          } else {
            var no_og = { og_title: data_url };
            console.timeEnd('req ogt');
            return cb('req og error', no_og);
          }
        }
      );
    }

    ////////////////metascraper/////////////////////////////////////////
    const getCharset = (response) => {
      var data_charset;
      if (response.headers !== undefined && response.headers['content-type']) {
        const ctype = response.headers['content-type'];
        data_charset = /charset=([^;]+)/g.exec(ctype);
      } else {
        data_charset = /charset=([^";]+)/g.exec(response.data.toString());
      }
      return data_charset === null || data_charset.length < 2
        ? undefined
        : data_charset[1];
    };

    axios.interceptors.response.use((response) => {
      const ax_charset = getCharset(response);
      if (!ax_charset) ax_charset = 'utf-8';
      response.data = Iconv.decode(response.data, ax_charset);
      return response;
    });

    const metascrap = async (meta_url) => {
      console.time('metascrap og');
      const { data: html } = await axios
        .request({
          method: 'GET',
          url: meta_url,
          responseType: 'arraybuffer',
          headers: {
            Accept: '*/*',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36 OPR/60.0.3255.170',
          },
        })
        .catch((error) => {
          console.log(error);
          return { data: '' };
        });
      const metadata = await metascraper({ html, url: data_url });
      if (!metadata || metadata.title === null || metadata.image === null) {
        console.timeEnd('metascrap og');
        facebook(data_url);
      } else {
        if (metadata.title.includes('$t') || metadata.title.includes('\\')) {
          metadata.title = Iconv.decode(metadata.title, 'euc-kr');
          if (metadata.title.includes('$t') || metadata.title.includes('\\')) {
            metadata.title = Iconv.decode(metadata.title, 'cp949');
          }
        }
        var meta_og = {
          og_title: metadata.title || data_url,
          og_image: metadata.image || '',
          og_description: metadata.description || '',
        };
        og = meta_og;
        console.log('meta og->og', og);
        console.timeEnd('metascrap og');
        return cb(null, og);
      }
    };
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
        return cb(null, og);
      } else {
        facebook(data_url);
      }
    } else if (data_url.includes('dict.naver.com/#/')) {
      fixed_url = data_url.replace(/#/, 'ko');
      facebook(fixed_url);
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
      return cb(null, og);
    } else {
      req_og(data_url);
    }
  } catch (err) {
    console.log('og.js error');
    console.log(err);
    var no_og = { og_title: data_url };
    return cb(err, no_og);
  }
};
