const pup = require("puppeteer");
require('dotenv').config();
const { Sneaker: SneakerModel } = require("./models/Sneaker");
const { arraysEqual } = require('./src/utils/utils');
const url = "https://www.correderua.com.br/";
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

(async () => {
    const browser = await pup.launch({ headless: false });
    const page = await browser.newPage();

    for (const term of searchFor) {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('#auto-complete');
        await page.type('#auto-complete', term);
        await page.waitForTimeout(1000);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.keyboard.press('Enter')
        ]);

        const links = await page.$$eval('li.span3 > .cn-melhor-imagem', el => el.map(container => container.querySelector('a.produto-sobrepor').href));
        for (const link of links) {
            await page.goto(link, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.row-fluid');
            await page.waitForTimeout(1000);

            const srcLink = link;

            const productReference = await page.$eval('.info-principal-produto', el => el.querySelector('span[itemprop^="sku"]').innerText);

            const store = "CDR";

            const img = await page.$eval('.conteiner-imagem', el => el.querySelector('a').href);

            const sneakerName = await page.$eval('.info-principal-produto', el => el.querySelector('h1').innerText);

            const price = await page.$eval('.preco-produto.destaque-preco strong[data-sell-price]', el => {
                const sellPriceAttribute = el.getAttribute('data-sell-price');

                return sellPriceAttribute ? sellPriceAttribute.trim() : null;
            });

            const discountPrice = await page.$eval('span.desconto-a-vista strong', el => {
                const priceText = el.innerText;
                const match = priceText.match(/R\$\s*([^\n]+)$/);
                if (match) {
                    return match[1];
                }
                return null;
            });

            const availableSizes = await page.$$eval('a.atributo-item:not(.indisponivel)', els => els.map(el => el.innerText));

            const sneakerObj = {
                srcLink,
                productReference,
                store,
                img,
                sneakerName,
                currentPrice: price,
                discountPrice: discountPrice,
                priceHistory: [{ price, date: new Date() }],
                availableSizes
            };

            if (sneakerName.toLowerCase().includes(term.toLowerCase()) && availableSizes.length !== 0) {
                console.log(sneakerObj);
                // try {
                //     const existingSneaker = await SneakerModel.findOne({ store, productReference });

                //     if (existingSneaker) {
                //         if (existingSneaker.currentPrice !== price || !arraysEqual(existingSneaker.availableSizes, availableSizes)) {

                //             existingSneaker.currentPrice = price;
                //             existingSneaker.priceHistory.push({ price, date: new Date() });
                //             existingSneaker.availableSizes = availableSizes;
                //             await existingSneaker.save();

                //             console.log('Sneaker atualizado no banco de dados.');
                //         } else {
                //             console.log('Sneaker já existe no banco de dados e o preço não mudou.');
                //         }
                //     } else {
                //         await SneakerModel.create(sneakerObj);
                //         console.log('Sneaker adicionado ao banco de dados.');
                //     }
                // } catch (error) {
                //     console.error('Erro ao chamar o endpoint da API:', error);
                // }
            } else {
                console.log('O modelo não corresponde à pesquisa. Não será salvo no banco de dados.');
            }
        }
        await page.waitForTimeout(3000);
    }
    await browser.close();
})();
