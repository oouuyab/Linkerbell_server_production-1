const axios = require('axios');
const cheer = require('cheerio');
const puppet = require('puppeteer');
//const Iconv = require('iconv').Iconv;
const Iconv = require('iconv-lite');
const jschardet = require('jschardet');

// * charset 확인
const checkCharSet = (str) => {
  return jschardet.detect(str);
};

// * iframe 태그에서 url을 받아오는 함수
const getIframeUrl = async (url) => {
  console.time('puppeteer');
  const browser = await puppet.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const urls = await page.$$eval('iframe', (el) =>
    [].map.call(el, (d) => d.src)
  );
  await browser.close();
  const _url = await urls[0];
  console.timeEnd('puppeteer');
  return _url;
};
const cheerio = async (url) => {
  try {
    console.log(url);
    //* 1. axios로 url에 get 요청을 보냄
    const getHtml = async () => {
      return await axios.get(url, {
        responseEncoding: 'binary',
        responseType: 'arraybuffer',
      });
    };
    //* 2. getHtml 요청에서 html을 받음
    const text = await getHtml().then(async (htmlDoc) => {
      //* 2-1 text: html에서 텍스트 저장하는 배열
      let innerText = [];
      //* 2-2 현재 html의 charset을 찾아 utf-8로 변환
      let charset = checkCharSet(htmlDoc.data).encoding;
      console.log(charset);
      let html = Iconv.decode(htmlDoc.data, charset);
      const $ = cheer.load(html);
      //* 2-3 getText: body tag의 text 가져오기
      //* 2-4 분기 (1) 특정한 조건에 해당하는 경우 iframe issue 해결을 위한 조건식 만들기
      //? mainframe이 있는 경우 // naver
      if ($('body').html().indexOf('mainFrame') > -1) {
        console.log('mainFrame 있음');
        const iframeUrl = await getIframeUrl(url);
        return cheerio(iframeUrl);
      } else {
        console.log('mainFrame 없음');
        innerText.push(
          $('body')
            .text()
            .replace(/  |(^\s*)|(\s*$)|\n|\t|\r/g, '')
        );
      }
      console.log(innerText[0]);
      if (innerText[0].length < 300) {
        console.log('300자 미만');
        return '';
      }
      console.log('길이: ' + innerText[0].length);
      return innerText.join().slice(0, 10000);
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = cheerio;
