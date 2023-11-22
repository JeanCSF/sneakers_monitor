const pup = require("puppeteer");
const { Sneaker: SneakerModel } = require("../../models/Sneaker");
const axios = require('axios');

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
        await page.goto(url);

        await page.waitForSelector('.awk-componente-modal-alterar-localizacao-show');
        await page.click('#ModalAlterarLocalizacaoFechar');
        await page.waitForSelector('.fulltext-search-box');

        await page.type('.fulltext-search-box', term);

        await Promise.all([
            page.waitForNavigation(),
            page.keyboard.press('Enter')
        ]);

        const links = await page.$$eval('.product-item-container', el => el.map(container => container.querySelector('a').href));
        for (const link of links) {
            await page.goto(link);
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

            const sneakerObj = { srcLink, productReference, store, img, sneakerName, price, availableSizes };
            try {
                const existingSneaker = await SneakerModel.findOne({ productReference });
                if (existingSneaker) {
                    if (existingSneaker.price !== price) {
                        existingSneaker.price = price;
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

module.exports = artwalk;
