const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

async function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({ headless: false }); // Launch a headless browser
  const page = await browser.newPage();

  // Navigate to Gmail
  await page.goto('https://mail.google.com/', { waitUntil: 'networkidle0' });

  // Log in to Gmail
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', 'itsmarin2@gmail.com');
  await delay(1000);
  await page.waitForSelector('div[id="identifierNext"]');
  await page.click('div[id="identifierNext"]');
  await delay(3000);
  await page.waitForSelector('input[type="password"].whsOnd.zHQkBf[jsname="YPqjbf"][name="Passwd"]');
  await page.type('input[type="password"].whsOnd.zHQkBf[jsname="YPqjbf"][name="Passwd"]', 'Menkshi123');
  await delay(1000);
  await page.waitForSelector('div[id="passwordNext"]');
  await page.click('div[id="passwordNext"]');
  await page.waitForNavigation();

  // Search for emails from a specific sender
  const searchQuery = 'is:unread from:help@gotinder.com "has been responded to" ';
  await delay(2000);
  await page.waitForSelector('input[aria-label="Search mail"][name="q"][type="text"].gb_re.aJh');
  await page.type('input[aria-label="Search mail"][name="q"][type="text"].gb_re.aJh', `${searchQuery}`);
  await page.keyboard.press('Enter');
  await delay(2000);
  await page.waitForSelector('.zA.zE');

  // Get a list of email subjects
  const emails = await page.$$eval('.zA.zE', (elements) =>
    elements.map((element) => element.textContent)
  );

  for (const email of emails) {
    // Check if the email contains the phrase "has been responded to"
    if (email.includes('has been responded to.')) {
        console.log(email)
      console.log('Tinder has replied');
    }
    else{
        
    }
  }

  await browser.close();
})();
