//const test = require('./testResult');

const category = async (arr) => {
  let newResult = [];
  for (let i = 0; i < arr.length; i++) {
    let newLabelResult = {};
    newLabelResult.score = arr[i].score;
    newLabelResult.label = newLabel(arr[i].label);
    newResult.push(newLabelResult);
  }
  console.log(newResult);
};

const newLabel = (label) => {
  if (label.indexOf('art and entertainment') > -1) {
    return '문화/예술';
  } else if (label.indexOf('automotive and vehicles') > -1) {
    return '자동차';
  } else if (label.indexOf('business and industrial') > -1) {
    return '비즈니스';
  } else if (label.indexOf('careers') > -1 || label.indexOf('education') > -1) {
    return '교육/JOB';
  } else if (
    label.indexOf('family and parenting') > -1 ||
    label.indexOf('pets') > -1
  ) {
    return '가족';
  } else if (
    label.indexOf('finance') > -1 ||
    label.indexOf('real estate') > -1
  ) {
    return '경제/부동산';
  } else if (
    label.indexOf('food and drink') > -1 ||
    label.indexOf('travel') > -1
  ) {
    return '여행/음식';
  } else if (
    label.indexOf('health and fitness') > -1 ||
    label.indexOf('hobbies and interests') > -1
  ) {
    return '취미/운동';
  } else if (label.indexOf('home and garden') > -1) {
    return '생활';
  } else if (
    label.indexOf('law, govt and politics') > -1 ||
    label.indexOf('news') > -1 ||
    label.indexOf('society') > -1
  ) {
    return '법률/정치/사회';
  } else if (label.indexOf('religion and spirituality') > -1) {
    return '종교';
  } else if (
    label.indexOf('technology and computing') > -1 ||
    label.indexOf('science') > -1
  ) {
    return '과학/IT';
  } else if (
    label.indexOf('shopping') > -1 ||
    label.indexOf('style and fashion') > -1
  ) {
    return '쇼핑/패션';
  } else if (label.indexOf('sports') > -1) {
    return '스포츠';
  }
};

module.exports = category;
