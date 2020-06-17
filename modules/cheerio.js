const axios = require('axios');
const Cheerio = require('cheerio');

const cheerio = async (url) => {
  console.time('cheerio');
  const getHtml = async () => {
    return await axios.get(url);
  };
  const text = await getHtml().then((html) => {
    let ulList = [];
    const $ = Cheerio.load(html.data);
    const $bodyList = $('body');

    $bodyList.each(function (i, elem) {
      ulList.push(
        $(this)
          .find('span')
          .text()
          .replace(/(^\s*)|(\s*$)|\n|\t|\r/g, '')
      );
      ulList.push(
        $(this)
          .find('p')
          .text()
          .replace(/(^\s*)|(\s*$)|\n|\t|\r/g, '')
      );
      ulList.push(
        $(this)
          .find('div')
          .text()
          .replace(/(^\s*)|(\s*$)|\n|\t|\r/g, '')
      );
      ulList.push(
        $(this)
          .find('li')
          .text()
          .replace(/(^\s*)|(\s*$)|\n|\t|\r/g, '')
      );
    });
    let str = ulList
      .join()
      .replace(/(^\s*)|(\s*$)|\n|\t|\r/g, '')
      .slice(0, 14999);
    return str;
  });
  console.timeEnd('cheerio');
  return text;
};

module.exports = cheerio;
