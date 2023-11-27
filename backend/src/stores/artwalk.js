const pup = require("puppeteer");
require('dotenv').config();
const { arraysEqual } = require('../utils/utils');
const { Sneaker: SneakerModel } = require("../../models/Sneaker");
const axios = require('axios');

const isProduction = process.env.NODE_ENV === 'production';

const BASEURL = isProduction ? process.env.PROD_BASE_URL : process.env.DEV_BASE_URL;

const url = "https://www.artwalk.com.br/";
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

async function artwalk() {
    const browser = await pup.launch({ headless: true });
    const page = await browser.newPage();

    for (const term of searchFor) {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('.awk-componente-modal-alterar-localizacao-show');
        await page.click('#ModalAlterarLocalizacaoFechar');
        await page.waitForSelector('.fulltext-search-box');

        await page.type('.fulltext-search-box', term);

        await Promise.all([
            page.waitForNavigation(),
            page.keyboard.press('Enter')
        ]);

        const scrollToEnd = async () => {
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
        };

        let previousHeight = 0;

        while (true) {
            await scrollToEnd();
            await page.waitForTimeout(1000);
            const currentHeight = await page.evaluate(() => document.body.scrollHeight);
            if (currentHeight === previousHeight) {
                break;
            }
            previousHeight = currentHeight;
        }

        const links = await page.$$eval('.product-item-container', el => el.map(container => container.querySelector('a').href));
        console.log(links.length)
        for (const link of links) {
            await page.goto(link, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.info-name-product');

            const srcLink = link;

            const productReference = await page.$eval('.productReference', el => el.innerText);

            const store = "Artwalk";

            const img = await page.$eval('.ns-product-image.is-selected', el => el.querySelector('img').src);

            const sneakerName = await page.$eval('.info-name-product > .productName', el => el.innerText);

            const price = await page.$eval('.ns-product-price__value', el => {
                const priceText = el.innerText;
                const match = priceText.match(/R\$\s*([^\n]+)$/);
                if (match) {
                    return match[1];
                }
                return null;
            });

            const availableSizes = await page.$$eval('.dimension-Tamanho:not(.item_unavaliable)', els => els.map(el => el.innerText));

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

module.exports = artwalk;
