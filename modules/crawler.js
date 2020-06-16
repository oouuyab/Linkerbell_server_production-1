const puppeteer = require('puppeteer');

const crawler = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('span span');

  const value = await page.evaluate(() => {
    let scrappedData = [];
    Array.from(document.querySelectorAll('span')).map((span) => {
      if (scrappedData.indexOf(span.textContent) === -1) {
        scrappedData.push(span.textContent);
      }
    });
    return scrappedData;
  });
  await browser.close();
  return value.join('');
};

module.exports = crawler;
