const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const dotenv = require("dotenv").config();

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "2019-07-12",
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
  x;

  naturalLanguageUnderstanding
    .analyze(analyzeParams)
    .then((analysisResults) => {
      console.log(JSON.stringify(analysisResults, null, 2));
    })
    .catch((err) => {
      console.log("error:", err);
    });
};

module.exports = classifier;
