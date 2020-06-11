//const test = require('./testResult');

const category = (arr) => {
  let newResult = [];
  for (let i = 0; i < arr.length; i++) {
    let newLabelResult = {};
    newLabelResult.score = arr[i].score;
    newLabelResult.label = newLabel(arr[i].label);
    newResult.push(newLabelResult);
  }
  return newResult;
};

const newLabel = (label) => {
  if (label.indexOf('art and entertainment') > -1) {
    return 1;
  } else if (label.indexOf('automotive and vehicles') > -1) {
    return 2;
  } else if (label.indexOf('business and industrial') > -1) {
    return 3;
  } else if (label.indexOf('careers') > -1 || label.indexOf('education') > -1) {
    return 4;
  } else if (
    label.indexOf('family and parenting') > -1 ||
    label.indexOf('pets') > -1
  ) {
    return 5;
  } else if (
    label.indexOf('finance') > -1 ||
    label.indexOf('real estate') > -1
  ) {
    return 6;
  } else if (
    label.indexOf('food and drink') > -1 ||
    label.indexOf('travel') > -1
  ) {
    return 7;
  } else if (
    label.indexOf('health and fitness') > -1 ||
    label.indexOf('hobbies and interests') > -1
  ) {
    return 8;
  } else if (label.indexOf('home and garden') > -1) {
    return 9;
  } else if (
    label.indexOf('law, govt and politics') > -1 ||
    label.indexOf('news') > -1 ||
    label.indexOf('society') > -1
  ) {
    return 10;
  } else if (label.indexOf('religion and spirituality') > -1) {
    return 11;
  } else if (
    label.indexOf('technology and computing') > -1 ||
    label.indexOf('science') > -1
  ) {
    return 12;
  } else if (
    label.indexOf('shopping') > -1 ||
    label.indexOf('style and fashion') > -1
  ) {
    return 13;
  } else if (label.indexOf('sports') > -1) {
    return 14;
  }
};

module.exports = category;
