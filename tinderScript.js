const puppeteer = require('puppeteer-extra');
const fs = require('fs').promises;
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

async function delay(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
}

async function getRandomSecondInput() {
    try {
        const secondInputFileContents = await fs.readFile('shadowbandescriptions.txt', 'utf8');
        const lines = secondInputFileContents.split('\n');
        const randomIndex = Math.floor(Math.random() * lines.length);
        return lines[randomIndex];
    } catch (error) {
        console.error('Error reading shadowbandescriptions.txt:', error);
        return ''; // Return an empty string as a fallback
    }
}

async function handleTinderCommand(email) {
    const descriptionText = await getRandomSecondInput();
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'); // Your user agent here
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://www.help.tinder.com/hc/en-us/requests/new?ticket_form_id=360000234392', { waitUntil: 'load' });
    await page.waitForSelector('input#request_custom_fields_360013897951[aria-required="true"]', { visible: true });
    await delay(1000)
    await page.type('input#request_custom_fields_360013897951[aria-required="true"]', email);
    await page.waitForSelector('a.nesty-input[aria-labelledby="request_custom_fields_360014014151_label"]'); // Which feature is this about?
    await page.click('a.nesty-input[aria-labelledby="request_custom_fields_360014014151_label"]');
    await page.waitForSelector('li[id="f_matching_messaging_bug"]');
    await page.click('li[id="f_matching_messaging_bug"]');
    const inputSecondFieldId = 'request_description';
    await delay(1500)
    await page.type(`#${inputSecondFieldId}`, descriptionText);
    await page.waitForSelector('input[type="submit"].tinder-btn', { visible: true });
    await delay(1500)
    await page.click('input[type="submit"].tinder-btn');
    await delay(4500)
    await browser.close();
    
    console.log("Closed!")
}

module.exports = { handleTinderCommand };
