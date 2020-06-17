const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const dotenv = require('dotenv').config();
const category = require('./category');
const crawler = require('./crawler');
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
    console.time('classifier');
    //const text = await crawler(url);
    const text = await cheerio(url);

    console.log(text.length);

    let analyzeParams;
    if (text.length < 5000) {
      console.log('text<5000');
      analyzeParams = {
        url: url,
        features: {
          categories: {
            limit: 3,
          },
        },
      };
    } else {
      console.log('text>=5000');
      analyzeParams = {
        text: text,
        features: {
          categories: {
            limit: 3,
          },
        },
      };
    }

    const newClassifier = async () => {
      let goNLU = await naturalLanguageUnderstanding.analyze(analyzeParams);
      let analysisNLU = function () {
        let analysis = goNLU.result.categories;
        let result = category(analysis)[0].label;
        return { result: result, analysis: analysis };
      };
      let resultNLU = await analysisNLU();
      return resultNLU;
    };
    let result = await newClassifier();
    console.log(result);
    console.timeEnd('classifier');
    return result;
  } catch (err) {
    return { result: 0, analysis: [] };
  }
};

module.exports = classifier;
