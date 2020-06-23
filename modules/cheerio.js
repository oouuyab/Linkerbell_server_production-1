const axios = require('axios');
const request = require('request-promise-native');
const cheer = require('cheerio');
const puppet = require('puppeteer');
const Iconv = require('iconv-lite');
const charset = require('charset');

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
  console.log('cheerio 실행');
  try {
    const innerText = [];
    console.log(url);
    //* 2. getHtml 요청에서 html을 받음

    const text = await request(
      {
        url: url,
        method: 'GET',
        encoding: null,
        timeout: 5000,
        followRedirect: true,
        maxRedirects: 10,
      },
      async (err, res, body) => {
        //* 1. encoding
        const enc = charset(res.headers, body);
        const decodedResult = Iconv.decode(body, enc);
        const $ = cheer.load(decodedResult);

        //* 2. 분기: 정한 조건에 해당하는 경우 iframe issue 해결을 위한 조건식 만들기
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
      }
    );
    console.log(innerText[0]);
    if (innerText[0].length < 150) {
      console.log('150자 미만');
      return '';
    }
    console.log('150자 이상');
    console.log('길이: ' + innerText[0].length);
    return innerText.join().slice(0, 10000);
  } catch (err) {
    console.log(err);
    return '';
  }
};

module.exports = cheerio;
