const pup = require("puppeteer");
const { Sneaker: SneakerModel } = require("../../models/Sneaker");
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
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('.input-text.required-entry');
        await page.type('.input-text.required-entry', term);
        await page.keyboard.press('Enter')
        await page.waitForTimeout(1000);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.keyboard.press('Enter')
        ]);

        const links = await page.$$eval('.df-card', el => el.map(container => container.querySelector('a').href));
        for (const link of links) {
            await page.goto(link, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.main-container');
            await page.waitForTimeout(1000);

            const srcLink = link;

            const productReference = await page.$eval('.sku', el => el.querySelector('span.value').innerText);

            const store = "YOUR ID";

            const img = await page.$eval('.cloud-zoom-wrap', el => el.querySelector('a').href);

            const sneakerName = await page.$eval('.product-name', el => el.querySelector('h1').innerText);

            const price = await page.evaluate(() => {
                const specialPriceElement = document.querySelector('.special-price .price');
                if (specialPriceElement) {
                    const priceText = specialPriceElement.innerText;
                    const match = priceText.match(/R\$\s*([^\n]+)/);
                    if (match) {
                        return match[1];
                    }
                }

                const regularPriceElement = document.querySelector('.regular-price .price');
                if (regularPriceElement) {
                    const priceText = regularPriceElement.innerText;
                    const match = priceText.match(/R\$\s*([^\n]+)/);
                    if (match) {
                        return match[1];
                    }
                }
                return null;
            });

            const availableSizes = await page.$$eval('option', els => {
                return els
                    .map(el => el.innerText.trim())
                    .filter(text => /\d+/.test(text));
            });

            const sneakerObj = { srcLink, productReference, store, img, sneakerName, price, availableSizes };
            try {
                const existingSneaker = await SneakerModel.findOne({ productReference });
                if (existingSneaker) {
                    if (existingSneaker.price !== price || existingSneaker.availableSizes !== availableSizes) {
                        existingSneaker.price = price;
                        existingSneaker.availableSizes = availableSizes;
                        await existingSneaker.save();
                        console.log('Sneaker atualizado no banco de dados.');
                    } else {
                        console.log('Sneaker já existe no banco de dados e o preço não mudou.');
                    }
                } else {
                    const apiResponse = await axios.post('http://localhost:3000/api/sneakers', sneakerObj);
                    console.log(apiResponse.data.msg);
                }
            } catch (error) {
                console.error('Erro ao chamar o endpoint da API:', error);
            }
        }
        await page.waitForTimeout(3000);
    }
    await browser.close();
};

module.exports = gdlp;
