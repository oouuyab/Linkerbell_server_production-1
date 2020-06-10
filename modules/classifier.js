const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const dotenv = require('dotenv').config();
const category = require('./category');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY,
  }),
  url: process.env.WATSON_URL,
});

const classifier = (url) => {
  const analyzeParams = {
    url: url,
    features: {
      categories: {
        limit: 3,
      },
    },
  };

  const result = () => {
    naturalLanguageUnderstanding.analyze(analyzeParams).then()
    let analysisResults = await JSON.stringify(analyzed, null, 2);
    let result = await analysisResults.result;
    console.log(result);
  };
  result();
  // const result = naturalLanguageUnderstanding
  //   .analyze(analyzeParams)
  //   .then((analysisResults) => {
  //     return JSON.stringify(analysisResults, null, 2)
  //   })
  //   .catch((err) => {

  //     console.log('error:', err);
  //   });
  // return result;
};

module.exports = classifier;
