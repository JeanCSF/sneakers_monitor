const pup = require("puppeteer");
require('dotenv').config();
const { arraysEqual } = require('../utils/utils');
const { Sneaker: SneakerModel } = require("../../models/Sneaker");

const url = "https://www.lojavirus.com.br/";
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

async function lojavirus() {
    const browser = await pup.launch({ headless: true });
    const page = await browser.newPage();
    console.log("lojavirus started");

    for (const term of searchFor) {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('.material-icons');
        await page.click('.material-icons');
        await page.waitForTimeout(1000);

        await page.waitForSelector('#txtBuscaMobile');
        await page.type('#txtBuscaMobile', term);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.keyboard.press('Enter')
        ]);

        const links = await page.$$eval('.imagem-spot', el => el.map(container => container.querySelector('a').href));
        for (const link of links) {
            await page.goto(link, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.segura-nome');

            const srcLink = link;

            const productReference = await page.$eval('.segura-nome', el => el.querySelector('h1').innerText.match(/\b[A-Z]+\d+-\d+\b/).toString());

            const store = "Loja Virus";
            await page.waitForSelector('.slick-slide');
            await page.waitForTimeout(1000);
            const img = await page.$eval('figure[itemprop^="associatedMedia"]', el => el.querySelector('a').href);

            const sneakerName = await page.$eval('.segura-nome', el => el.querySelector('h1').innerText);

            const price = await page.$eval('.precoPor', el => {
                const priceText = el.innerText;
                const match = priceText.match(/R\$\s*([^\n]+)$/);
                if (match) {
                    return match[1];
                }
                return null;
            });

            const availableSizes = await page.$$eval('.valorAtributo:not(.disabled)', els => {
                return els
                    .map(el => el.innerText.trim())
                    .filter(text => /\d+/.test(text));
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
                    const existingSneaker = await SneakerModel.findOne({ store, productReference });

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
    console.log("lojavirus finished");
};

module.exports = lojavirus;
