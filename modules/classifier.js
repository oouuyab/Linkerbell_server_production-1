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
  try {
    console.time('classifier time');
    console.log('cheeio실행');
    const text = await cheerio(url);
    console.log(text);
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
    console.log('newclassfier');
    const newClassifier = async () => {
      let goNLU = await naturalLanguageUnderstanding.analyze(analyzeParams);
      let analysisNLU = function () {
        let analysis = goNLU.result.categories;
        let result;
        if (analysis.length === 0) {
          result = 21;
          analysis = [{ score: 0, label: '/etc' }];
        } else {
          result = category(analysis)[0].label;
        }
        console.log(result);
        return { result: result, analysis: analysis };
      };
      let resultNLU = await analysisNLU();
      return resultNLU;
    };
    let result = await newClassifier();
    console.log(result);
    console.timeEnd('classifier time');
    return result;
  } catch (err) {
    console.log(err);
    return { result: 21, analysis: [] };
  }
};

module.exports = classifier;
