const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const dotenv = require('dotenv').config();
const category = require('./category');
const cheerio = require('./cheerio');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY,
  }),
  url: process.env.WATSON_URL,
});

const classifier = async (url) => {
  console.time('classifier');
  try {
    console.log('cheeio실행');
    //! 예외 1 쇼핑
    if (
      //! 쿠팡
      url.indexOf('https://m.coupang.com/') > -1 ||
      url.indexOf('https://www.coupang.com') > -1 ||
      //! 네이버 쇼핑
      url.indexOf('shopping.naver.com/') > -1 ||
      //! 옥션
      url.indexOf('auction.co.kr/') > -1 ||
      //! 지마켓
      url.indexOf('gmarket.co.kr/') > -1 ||
      //! ssg
      url.indexOf('shinsegaemall.ssg.com') > -1 ||
      //! 알리 익스프레스
      url.indexOf('aliexpress.com') > -1 ||
      //! 다나와
      url.indexOf('prod.danawa.com') > -1 ||
      url.indexOf('http://m.danawa.com/product/') > -1
    ) {
      console.timeEnd('classifier');
      return { result: 18, analysis: [{ score: 1, label: '/shopping' }] };
      // } else if(){
    } else {
      const text = await cheerio(url);
      let analyzeParams;
      if (text.length < 150) {
        console.log(`text : ${text.length} < 150`);
        analyzeParams = {
          url: url,
          features: {
            categories: {
              limit: 3,
            },
          },
        };
      } else {
        console.log(`text : ${text.length} > 150`);
        analyzeParams = {
          text: text,
          features: {
            categories: {
              limit: 3,
            },
          },
        };
      }
      console.log('카테고리 재분류');
      const newClassifier = async () => {
        let goNLU = await naturalLanguageUnderstanding.analyze(analyzeParams);
        let analysisNLU = function () {
          let analysis = goNLU.result.categories;
          let category_id;
          if (analysis.length === 0) {
            //! 분석에 실패한 경우
            category_id = 21;
            analysis = [{ score: 0, label: '/etc' }];
          } else if (analysis[0].score < 0.7) {
            //! score가 일정 기준을 넘지 않는 경우
            category_id = 21;
            analysis = [{ score: 0, label: '/etc' }];
          } else {
            //* 일반적인 경우
            category_id = category(analysis)[0].label;
          }
          return { result: category_id, analysis: analysis };
        };
        let resultNLU = await analysisNLU();
        return resultNLU;
      };
      let result = await newClassifier();
      console.timeEnd('classifier');
      return result;
    }
  } catch (err) {
    console.log(err);
    console.timeEnd('classifier');
    return { result: 21, analysis: [{ score: 0, label: '/etc' }] };
  }
};

module.exports = classifier;
