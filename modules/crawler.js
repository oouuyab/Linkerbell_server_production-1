const puppeteer = require('puppeteer');

const crawler = async (url) => {
  console.time('puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('span span');

  const value = await page.evaluate(() => {
    let scrappedData = [];
    Array.from(document.getElementsByTagName('body')).map((span) => {
      if (scrappedData.indexOf(span.textContent) === -1) {
        scrappedData.push(span.textContent);
      }
    });
    return scrappedData;
  });
  await browser.close();
  console.timeEnd('puppeteer');
  return value
    .join('')
    .replace(/(^\s*)|(\s*$)|\n|\t|\r/g, '')
    .slice(0, 14999);
};

module.exports = crawler;
