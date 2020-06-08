const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "2019-07-12",
  authenticator: new IamAuthenticator({
    apikey: "mTAwq-YsbOxk2iRR_e76lqzHP0kmgrb9SRegZXfKI3RN",
  }),
  url:
    "https://api.kr-seo.natural-language-understanding.watson.cloud.ibm.com/instances/c9b7e755-1ebc-4ffb-9a90-b2bedc2bb217",
});

const analyzeParams = {
  url:
    "https://m.blog.naver.com/PostView.nhn?blogId=realzzin&logNo=220236437474&proxyReferer=https:%2F%2Fwww.google.com%2F",
  features: {
    categories: {
      limit: 3,
    },
  },
};

naturalLanguageUnderstanding
  .analyze(analyzeParams)
  .then((analysisResults) => {
    console.log(JSON.stringify(analysisResults, null, 2));
  })
  .catch((err) => {
    console.log("error:", err);
  });
