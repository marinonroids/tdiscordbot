//http://6544f8f5-101336:2mf7p3fh6a@109.236.80.193:21335

const puppeteer = require('puppeteer');

const proxy = '109.236.80.193:21335';
const username = '6544f8f5-101336';
const password = '2mf7p3fh6a';

async function delay(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
}

(async () => {
    // Pass proxy URL into the --proxy-server arg
    const browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`],
        headless: false
    });

    const page = await browser.newPage()
    // Authenticate our proxy with username and password defined above
    await page.authenticate({ username, password });

    await delay(1000)
    await page.goto('https://www.ip2location.com');
    await delay(5000)
    await browser.close();
})();
