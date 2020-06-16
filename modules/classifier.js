const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const dotenv = require('dotenv').config();
const category = require('./category');
const crawler = require('./crawler');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY,
  }),
  url: process.env.WATSON_URL,
});

const classifier = async (url) => {
  ///const crawl = await crawler(url);
  //console.log(crawl);
  const analyzeParams = {
    //text: crawl,
    url: url,
    features: {
      categories: {
        limit: 3,
      },
    },
  };

  const newClassifier = async () => {
    let goNLU = await naturalLanguageUnderstanding.analyze(analyzeParams);
    let analysisNLU = function () {
      let analysis = goNLU.result.categories;
      console.log(analysis);
      let result = category(analysis)[0].label;
      return result;
    };
    let resultNLU = await analysisNLU();
    return resultNLU;
  };
  let result = await newClassifier();
  return result;
};

module.exports = classifier;
