const { Cluster } = require("puppeteer-cluster");
const { Sneaker: SneakerModel } = require("./models/Sneaker");
const { arraysEqual } = require('./src/utils/utils');

async function updateOrCreateSneaker(sneakerObj, term) {
    const { productReference, store, sneakerName, availableSizes } = sneakerObj;
    if (sneakerName.toLowerCase().includes(term.toLowerCase()) && availableSizes.length !== 0) {
        try {
            console.log(sneakerObj)
            const existingSneaker = await SneakerModel.findOne({ store, productReference });
            if (existingSneaker) {
                if (existingSneaker.currentPrice !== sneakerObj.currentPrice || !arraysEqual(existingSneaker.availableSizes, sneakerObj.availableSizes)) {
                    existingSneaker.currentPrice = sneakerObj.currentPrice;
                    existingSneaker.priceHistory.push({ price: sneakerObj.currentPrice, date: new Date() });
                    existingSneaker.availableSizes = sneakerObj.availableSizes;
                    await existingSneaker.save();
                    console.log('Sneaker atualizado no banco de dados.');
                } else {
                    console.log('Sneaker já existe no banco de dados e o preço não mudou.');
                }
            } else {
                await SneakerModel.create(sneakerObj);
                console.log('Sneaker adicionado ao banco de dados.');
            }
            // updateOrCreateSneaker(sneakerObj);
        } catch (error) {
            console.error('Erro ao chamar o endpoint da API:', error);
        }
    } else {
        console.log('O modelo não corresponde à pesquisa. Não será salvo no banco de dados.');
    }
}

const scrapeArtwalk = async (page, term) => {

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
            discountPrice: null,
            priceHistory: [{ price, date: new Date() }],
            availableSizes
        };
        updateOrCreateSneaker(sneakerObj, term);
    }
    console.log('Scraping Artwalk concluído com sucesso.');
}

const scrapeGDLP = async (page, term) => {
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
            discountPrice: null,
            priceHistory: [{ price, date: new Date() }],
            availableSizes
        };
        updateOrCreateSneaker(sneakerObj, term);
    }
    console.log('Scraping GDLP concluído com sucesso.');
}

const scrapeLojaVirus = async (page, term) => {
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
            discountPrice: null,
            priceHistory: [{ price, date: new Date() }],
            availableSizes
        };
        updateOrCreateSneaker(sneakerObj, term);
    }

    console.log('Scraping Loja Virus concluído com sucesso.');
}

const scrapeCDR = async (page, term) => {
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
            discountPrice: null,
            priceHistory: [{ price, date: new Date() }],
            availableSizes
        };
        updateOrCreateSneaker(sneakerObj, term);
    }

    console.log('Scraping CDR concluído com sucesso.');
}

const scrapeYourId = async (page, term) => {
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

        const sneakerObj = {
            srcLink,
            productReference,
            store,
            img,
            sneakerName,
            currentPrice: price,
            discountPrice: null,
            priceHistory: [{ price, date: new Date() }],
            availableSizes
        };
        updateOrCreateSneaker(sneakerObj, term);
    }

    console.log('Scraping Your ID concluído com sucesso.');
}

const urls = [
    { url: 'https://www.artwalk.com.br/', storeFunction: scrapeArtwalk },
    { url: 'https://gdlp.com.br/', storeFunction: scrapeGDLP },
    { url: 'https://www.lojavirus.com.br/', storeFunction: scrapeLojaVirus },
    { url: 'https://www.correderua.com.br/', storeFunction: scrapeCDR },
    { url: 'https://youridstore.com.br/', storeFunction: scrapeYourId },
];

const searchFor = [
    'air force',
    'air max',
    // 'air jordan 1 high', 
    // 'air jordan 1 mid', 
    // 'air jordan 1 low',
    // 'air jordan 2',
    // 'air jordan 3',
    // 'air jordan 4',
    // 'air jordan 5',
    // 'air jordan 6',
];
async function mainCluster() {
    try {
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency: 5,
            puppeteerOptions: {
                headless: false,
            }
        });

        let tasksInProgress = 0;
        const tasksCompleted = [];

        await cluster.task(async ({ page, data: { url, storeFunction } }) => {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            for (const term of searchFor) {
                await storeFunction(page, term);
            }

        });

        tasksInProgress--;
        tasksCompleted.push(true);

        for (const { url, storeFunction } of urls) {
            tasksInProgress++;
            cluster.queue({ url, storeFunction });
        }

        while (tasksInProgress > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        await cluster.idle();
        await cluster.close();
    } catch (error) {
        console.error('Erro inesperado:', error);
    }
};
module.exports = mainCluster;