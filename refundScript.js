const puppeteer = require('puppeteer-extra');
const fs = require('fs').promises;
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

async function delay(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
}

async function getRandomThirdInput() {
    try {
        const ThirdInputFileContents = await fs.readFile('refunddescriptions.txt', 'utf8');
        const lines = ThirdInputFileContents.split('\n');
        const randomIndex = Math.floor(Math.random() * lines.length);
        return lines[randomIndex];
    } catch (error) {
        console.error('Error reading refunddescriptions.txt:', error);
        return ''; // Return an empty string as a fallback
    }
}

async function handleRefundCommand(email, orderID) {
    const descriptionText = await getRandomThirdInput();
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'); // Your user agent here
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://www.help.tinder.com/hc/en-us/requests/new?ticket_form_id=360000234452', { waitUntil: 'load' });
    await page.waitForSelector('a.nesty-input[aria-labelledby="request_custom_fields_360013981632_label"]');
    await page.click('a.nesty-input[aria-labelledby="request_custom_fields_360013981632_label"]');
    await page.waitForSelector('li[id="f_refund_request"]');
    await page.click('li[id="f_refund_request"]');
    await page.waitForSelector('a.nesty-input[aria-labelledby="request_custom_fields_360013898451_label"]');
    await page.click('a.nesty-input[aria-labelledby="request_custom_fields_360013898451_label"]');
    await page.waitForSelector('li[id="f_web"]');
    await delay(1500);
    await page.click('li[id="f_web"]');
    await page.waitForSelector('input#request_custom_fields_360013897951[aria-required="true"]', { visible: true });
    await page.type('input#request_custom_fields_360013897951[aria-required="true"]', email);
    await page.waitForSelector('input#request_custom_fields_360013867472[aria-required="false"]', { visible: true });
    await page.type('input#request_custom_fields_360013867472[aria-required="false"]', orderID);
    const inputSecondFieldId = 'request_description';
    await page.type(`#${inputSecondFieldId}`, descriptionText);
    await page.waitForSelector('input[type="submit"].tinder-btn', { visible: true });
    await page.click('input[type="submit"].tinder-btn');
    await browser.close()
    console.log("Closed!")

}

module.exports = { handleRefundCommand };

