module.exports = {
  addToken: require('./auth/addToken'),
  checkToken: require('./auth/checkToken'),
  enToken: require('./auth/enToken'),
  updateToken: require('./auth/updateToken'),
  addOauthToken: require('./auth/addOauthToken'),
  classifier: require('./classifier/classifier'),
  category: require('./classifier/category'),
  cheerio: require('./classifier/cheerio'),
  handleException: require('./classifier/handleException'),
  og: require('./og'),
};
