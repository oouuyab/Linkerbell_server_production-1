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

const newLabel = (data) => {
  const label = data.split('/');
  console.log(label);
  if (label[1] === 'art and entertainment') {
    return 1;
  } else if (label[1] === 'automotive and vehicles') {
    return 2;
  } else if (label[1] === 'business and industrial') {
    return 3;
  } else if (label[1] === 'careers' || label[1] === 'education') {
    return 4;
  } else if (label[1] === 'family and parenting' || label[1] === 'pets') {
    return 5;
  } else if (label[1] === 'finance' || label[1] === 'real estate') {
    return 6;
  } else if (label[1] === 'food and drink') {
    return 7;
  } else if (label[1] === 'travel') {
    return 8;
  } else if (label[1] === 'health and fitness') {
    return 9;
  } else if (label[1] === 'hobbies and interests') {
    return 10;
  } else if (label[1] === 'home and garden') {
    return 11;
  } else if (label[1] === 'law, govt and politics') {
    return 12;
  } else if (label[1] === 'news') {
    return 13;
  } else if (label[1] === 'society') {
    return 14;
  } else if (label[1] === 'religion and spirituality') {
    return 15;
  } else if (label[1] === 'technology and computing') {
    return 16;
  } else if (label[1] === 'science') {
    return 17;
  } else if (label[1] === 'shopping') {
    return 18;
  } else if (label[1] === 'style and fashion') {
    return 19;
  } else if (label[1] === 'sports') {
    return 20;
  }
};

module.exports = category;
