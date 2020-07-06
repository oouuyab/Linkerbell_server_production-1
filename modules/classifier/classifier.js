const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const dotenv = require('dotenv').config();
const getCategory = require('./category');
const cheerio = require('./cheerio');

//: Watson NLU 설정
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY,
  }),
  url: process.env.WATSON_URL,
});

//# url을 받아 watson NLU의 params 생성하는 함수 (url/text)
const getParams = async (url) => {
  const text = await cheerio(url);
  let params = { features: { categories: { limit: 3 } } };
  let result;
  if (text.length > 200) {
    result = { text: text };
  } else {
    result = { url: url };
  }
  return Object.assign(params, result);
};

//# NLU를 돌려 oldCategory를 return하는 함수
const getOldCategory = async (params) => {
  return await naturalLanguageUnderstanding.analyze(params);
};

//# oldCategory를 받아 newCategory를 return하는 함수
let getNewCategory = (oldCategory) => {
  let analysis = oldCategory.result.categories;
  let category_id;
  if (analysis.length === 0 || analysis[0].score < 0.6) {
    //! 분기: 분석에 실패한 경우 ||  score가 일정 기준을 넘지 않는 경우
    category_id = 21;
    analysis = [{ score: 0, label: '/etc' }];
  } else {
    //? 일반적인 경우
    category_id = getCategory(analysis)[0].label;
  }
  return { result: category_id, analysis: analysis };
};

//. classifier 함수
const classifier = async (url) => {
  console.time('classifier');
  try {
    console.timeEnd('classifier');
    const params = await getParams(url);
    const oldCategory = await getOldCategory(params);
    const newCategory = await getNewCategory(oldCategory);
    console.log(newCategory);
    return newCategory;
  } catch (err) {
    console.log('classifier err');
    console.log(err);
    console.timeEnd('classifier');
    return { result: 21, analysis: [{ score: 0, label: '/etc' }] };
  }
};

module.exports = classifier;
