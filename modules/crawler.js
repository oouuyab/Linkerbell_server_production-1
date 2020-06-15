const puppeteer = require('puppeteer-core');

const crawler = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const value = await page.evalueate(() => {
    let scrappedDate = [];
    if (url.indexOf('naver') > -1 && url.indexOf('news') > -1) {
      const tbodyChildren = document.querySelector('.content').childNodes[5];

      for (let i = 1; i < tbodyChildren.length; i++) {
        scrappedDate.push({
          version: tbodyChilds[i].children[0].textContent,
          released: tbodyChilds[i].children[1].textContent,
          changes: tbodyChilds[i].children[2].textContent,
        });
      }
    }
    console.log(scrappedDate);
    return scrappedDate;
  });
  await browser.close();
  value();
};

module.exports = crawler;
