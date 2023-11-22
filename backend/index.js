const pup = require("puppeteer");

const url = "https://gdlp.com.br/";
const searchFor = 'air force';

(async () => {
    const browser = await pup.launch({ headless: false });
    const page = await browser.newPage();
    console.log('init ok!');

    await page.goto(url);
    console.log('url access');

    await page.waitForSelector('.skip-link.skip-search');
    await page.click('.skip-link.skip-search');
    await page.waitForTimeout(1000);

    await page.waitForSelector('.input-text.required-entry');
    await page.type('.input-text.required-entry', searchFor);
    await page.waitForTimeout(1000);

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        page.keyboard.press('Enter')
    ]);

    const links = await page.$$eval('li.item.last', el => el.map(container => container.querySelector('a').href));
    console.log(links);
    for (const link of links) {
        await page.goto(link);
        await page.waitForSelector('.main-container');
        await page.waitForTimeout(1000);

        const srcLink = link;
        const img = await page.$eval('figure', el => el.querySelector('img').src);
        const productReference = await page.$eval('#product-attribute-specs-table', el => el.querySelector('tr.last.even > td').innerText);
        const sneakerName = await page.$eval('.breadcrumbs', el => el.querySelector('li.product > strong').innerText);
        const price = await page.$eval('.regular-price', el => {
            const priceText = el.querySelector('span').innerText;
            const match = priceText.match(/R\$\s*([^\n]+)/);
            if (match) {
                return match[1];
            }
            return null;
        });
        const availableSizes = await page.$$eval('option', els => {
            return els
                .map(el => el.innerText)
                .filter(text => text.trim() !== 'Selecione...');
        });


        const sneakerObj = { srcLink, img, productReference, sneakerName, price, availableSizes };
        console.log(sneakerObj);
    }
    await page.waitForTimeout(3000);
    await browser.close();
})();
