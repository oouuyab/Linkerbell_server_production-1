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
  console.log('classifier');
  try {
    console.log('cheeio실행');
    //! 예외 1 쿠팡 (https://m.coupang.com/ || https://www.coupang.com)
    if (
      url.indexOf('https://m.coupang.com/') > -1 ||
      url.indexOf('https://www.coupang.com') > -1
    ) {
      console.log('쿠팡!');
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
            category_id = 21;
            analysis = [{ score: 0, label: '/etc' }];
          } else {
            category_id = category(analysis)[0].label;
          }
          console.log(category_id);
          return { result: category_id, analysis: analysis };
        };
        let resultNLU = await analysisNLU();
        return resultNLU;
      };

      let result = await newClassifier();
      console.log(result);
      return result;
    }
  } catch (err) {
    console.log(err);
    return { result: 21, analysis: [{ score: 0, label: '/etc' }] };
  }
};

module.exports = classifier;
