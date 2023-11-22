const pup = require("puppeteer");
const axios = require('axios');

const url = "https://gdlp.com.br/";
const searchFor = [
    'air force'
    // 'air max',
    // 'air jordan 1 high', 
    // 'air jordan 1 mid', 
    // 'air jordan 1 low',
    // 'air jordan 2',
    // 'air jordan 3',
    // 'air jordan 4',
    // 'air jordan 5',
    // 'air jordan 6',
];

async function gdlp() {
    const browser = await pup.launch({ headless: true });
    const page = await browser.newPage();

    for (const term of searchFor) {
        await page.goto(url);

        await page.waitForSelector('.skip-link.skip-search');
        await page.click('.skip-link.skip-search');
        await page.waitForTimeout(1000);

        await page.waitForSelector('.input-text.required-entry');
        await page.type('.input-text.required-entry', term);
        await page.waitForTimeout(1000);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.keyboard.press('Enter')
        ]);

        const links = await page.$$eval('li.item.last', el => el.map(container => container.querySelector('a').href));
        for (const link of links) {
            await page.goto(link);
            await page.waitForSelector('.main-container');
            await page.waitForTimeout(1000);

            const srcLink = link;

            const productReference = await page.$eval('#product-attribute-specs-table', el => el.querySelector('tr.last.even > td').innerText);

            const store = "GDLP";
            
            const img = await page.$eval('figure', el => el.querySelector('img').src);

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

            const sneakerObj = { srcLink, productReference, store, img, sneakerName, price, availableSizes };
            try {
                const apiResponse = await axios.post('http://localhost:3000/api/sneakers', sneakerObj);
                console.log(apiResponse.data.msg);
            } catch (error) {
                console.error('Erro ao chamar o endpoint da API:', error);
            }
        }
        await page.waitForTimeout(3000);
    }
    await browser.close();
};

module.exports = gdlp;
