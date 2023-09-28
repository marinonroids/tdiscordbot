const puppeteer = require('puppeteer-extra');
const fs = require('fs').promises;
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

async function delay(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
}

const proxies = [
    '217.23.11.194:38824;dffa005f-88825;2bos00dm5s',
    '217.23.11.194:43625;3291ab43-93626;23pwsskppo',
    '109.236.80.193:22220;3d91b4a5-102221;1iegs0jssi',
    '217.23.11.194:25036;9fa90874-75037;1rsq4qpk3k',
    '109.236.80.193:21826;2295f4e4-101827;lrh56c3g6',
    '109.236.80.193:26486;ce0efb11-106487;1ikzwkwsxr',
    '109.236.80.193:23506;575910f9-103507;258eu1m5op',
    '109.236.80.193:21648;e42d8561-101649;1h85cgrlvn',
    '109.236.80.193:24021;deee7110-104022;248egf41i4',
    // Add more proxy entries as needed
];


async function getRandomThirdInput() {
    try {
        const ThirdInputFileContents = await fs.readFile('docs/refunddescriptions.txt', 'utf8');
        const lines = ThirdInputFileContents.split('\n');
        const randomIndex = Math.floor(Math.random() * lines.length);
        return lines[randomIndex];
    } catch (error) {
        console.error('Error reading refunddescriptions.txt:', error);
        return ''; // Return an empty string as a fallback
    }
}

async function getRandomProxy() {
    const randomIndex = Math.floor(Math.random() * proxies.length);
    const [proxy, username, password] = proxies[randomIndex].split(';');
    return { proxy, username, password };
}

async function handleRefundCommand(email, orderID) {
    const { client } = require('/Users/marin/Documents/GitHub/tdiscordbot/bot');
    const { proxy, username, password } = await getRandomProxy();
    const descriptionText = await getRandomThirdInput();
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({ 
        args: [`--proxy-server=${proxy}`],
        headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'); // Your user agent here
    await page.setViewport({ width: 1920, height: 1080 });
    await page.authenticate({ username, password });
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
    await delay(2000)
    const CurrentURL = page.url();
    if (CurrentURL === 'https://www.help.tinder.com/hc/en-us?return_to=%2Fhc%2Frequests') {
        console.log('Success!');
        client.emit('refundSuccess', email, orderID);
        await browser.close();
        
    } else {
        await browser.close();
        console.log('Failed!');
    }

}

module.exports = { handleRefundCommand };

