const pup = require("puppeteer");
require('dotenv').config();
const axios = require('axios');

const { Sneaker: SneakerModel } = require("../../models/Sneaker");
const { arraysEqual } = require('../utils/utils');

const isProduction = process.env.NODE_ENV === 'production';

const BASEURL = isProduction ? process.env.PROD_BASE_URL : process.env.DEV_BASE_URL;

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
            await page.goto(link, { waitUntil: 'domcontentloaded' });
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

            const sneakerObj = {
                srcLink,
                productReference,
                store,
                img,
                sneakerName,
                currentPrice: price,
                priceHistory: [{ price, date: new Date() }],
                availableSizes
            };

            if (sneakerName.toLowerCase().includes(term.toLowerCase()) && availableSizes.length !== 0) {
                try {
                    const existingSneaker = await SneakerModel.findOne({ productReference, store });

                    if (existingSneaker) {
                        if (existingSneaker.currentPrice !== price || !arraysEqual(existingSneaker.availableSizes, availableSizes)) {

                            existingSneaker.currentPrice = price;
                            existingSneaker.priceHistory.push({ price, date: new Date() });
                            existingSneaker.availableSizes = availableSizes;
                            await existingSneaker.save();

                            console.log('Sneaker atualizado no banco de dados.');
                        } else {
                            console.log('Sneaker já existe no banco de dados e o preço não mudou.');
                        }
                    } else {
                        await SneakerModel.create(sneakerObj);
                        console.log('Sneaker adicionado ao banco de dados.');
                    }
                } catch (error) {
                    console.error('Erro ao chamar o endpoint da API:', error);
                }
            } else {
                console.log('O modelo não corresponde à pesquisa. Não será salvo no banco de dados.');
            }
        }
        await page.waitForTimeout(3000);
    }
    await browser.close();
};

module.exports = gdlp;
