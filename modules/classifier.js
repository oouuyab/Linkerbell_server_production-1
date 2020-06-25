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
    //* 0. 예외 처리
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
      return { result: 18, analysis: [{ score: 1, label: '/shopping' }] };
    } else if (
      //! 예외 2 네이버 사전, 파파고
      url.indexOf('dict.naver.com') > -1 ||
      url.indexOf('papago.naver.com') > -1
    ) {
      return { result: 4, analysis: [{ score: 1, label: '/education' }] };
    } else if (
      url.indexOf('https://soundcloud.com/') > -1 ||
      url.indexOf('https://m.soundcloud.com/') > -1 ||
      url.indexOf('netflix.com') > -1
    ) {
      return {
        result: 1,
        analysis: [{ score: 1, label: '/art and entertainment' }],
      };
    } else {
      //* 1. text or url로 카테고리 분석
      const text = await cheerio(url);
      console.log(text);
      //* 1-1 watson api params를 담는 변수
      let analyzeParams;
      //! 분기 : text가 150자 미만인 경우 url로 카테고리 분석
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
        //! 분기: text가 150자 이상인 경우 text로 카테고리 분석
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
      //* 2. 카테고리 재분류
      console.log('카테고리 재분류');
      const newClassifier = async () => {
        // * 2-1 분석 시작
        let runNLU = await naturalLanguageUnderstanding.analyze(analyzeParams);
        // * 2-2 분석
        let analysisNLU = function (runNLU) {
          //* 2-3 분석 결과
          let analysis = runNLU.result.categories;
          // * 2-4 카테고리 id를 담는 변수
          let category_id;
          if (analysis.length === 0) {
            //! 분기: 분석에 실패한 경우
            category_id = 21;
            analysis = [{ score: 0, label: '/etc' }];
            // } else if (analysis[0].score < 0.7) {
            // // ! 분기:  score가 일정 기준을 넘지 않는 경우
            //   category_id = 21;
            //   analysis = [{ score: 0, label: '/etc' }];
          } else {
            //? 일반적인 경우
            category_id = category(analysis)[0].label;
          }
          // * 2-5 category_id와 분석 결과를 담아 리턴
          return { result: category_id, analysis: analysis };
        };
        // * 3: 결과 리턴
        let resultNLU = await analysisNLU(runNLU);
        return resultNLU;
      };
      // * 4: 결과 리턴
      let result = await newClassifier();
      console.log(result);
      console.timeEnd('classifier');
      return result;
    }
  } catch (err) {
    console.log('classifier err');
    console.log(err);
    console.timeEnd('classifier');
    return { result: 21, analysis: [{ score: 0, label: '/etc' }] };
  }
};

module.exports = classifier;
