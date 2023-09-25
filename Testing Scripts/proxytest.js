const puppeteer = require('puppeteer');


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

async function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

(async () => {
    for (const proxyInfo of proxies) {
        const [proxy, username, password] = proxyInfo.split(';');

        const browser = await puppeteer.launch({
            args: [`--proxy-server=${proxy}`],
            headless: false
        });

        const page = await browser.newPage();
        await page.authenticate({ username, password });

        await delay(1000);
        await page.goto('https://ipinfo.io/');
        await delay(5000);
        await browser.close();
    }
})();
