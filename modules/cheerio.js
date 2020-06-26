const axios = require('axios');
const cheer = require('cheerio');
const Iconv = require('iconv-lite');
const charset = require('charset');

const cheerio = async (url) => {
  console.log('cheerio 실행');
  console.time('cheerio');
  try {
    //* 0. getIframeUrl 에러로 url이 ''로 왔을 경우
    if (url === '') {
      console.timeEnd('cheerio');
      return '';
    }
    //* 1. axios로 url에 get 요첨을 보냄
    console.log(url);
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
    //* 2. getHtml 요청에서 html을 받음
    const text = await getHtml().then(async (htmlDoc) => {
      //* 2-1 innerText : html에서 텍스트를 저장하는배열
      let innerText = [];
      //* 2-2 decoding
      const enc = charset(htmlDoc.headers, htmlDoc.data);
      const decodedResult = Iconv.decode(htmlDoc.data, enc);
      const $ = cheer.load(decodedResult);
      //* 2-3 getText: body tag의 text 가져오기
      //! 분기 : naver Post 인지 판단
      if ($('head').html().indexOf('post.naver.com/') > -1) {
        console.log('naver post');
        innerText.push(
          $('body')
            .html()
            .replace('<script type="x-clip-content" id="__clipContent">', '')
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/(<([^>]+)>)/gi, '')
            .replace(/  |&nbsp;|(^\s*)|(\s*$)|\n|\t|\r/g, '')
        );
      } else {
        if (url.indexOf('twitter.com/') > -1) {
          console.log($('meta[property="og:title"]').attr('content'));
          return '';
        }
        //! 분기 : <iframe></iframe> 이 있는지 판단
        if ($('body').html().indexOf('mainFrame') > -1) {
          console.log('mainFrame 있음');
          let iframeUrl;
          if (url.indexOf('https://m.blog.naver.com') > -1) {
            console.log('naver blog - mobile');
            iframeUrl = 'https://m.blog.naver.com' + $('iframe').attr('src');
          } else if (url.indexOf('https://blog.naver.com') > -1) {
            console.log('naver blog - mobile');
            iframeUrl = 'https://blog.naver.com' + $('iframe').attr('src');
          }
          console.log(iframeUrl);
          return cheerio(iframeUrl);
        } else {
          console.log('mainFrame 없음');
          innerText.push(
            $('body')
              .text()
              .replace(/  |(^\s*)|(\s*$)|\n|\t|\r/g, '')
          );
        }
      }
      return innerText.join('').slice(0, 15000);
    });
    console.timeEnd('cheerio');
    return text;
  } catch (err) {
    console.log('cheerio err');
    console.log(err);
    console.timeEnd('cheerio');
    return '';
  }
};

module.exports = cheerio;
