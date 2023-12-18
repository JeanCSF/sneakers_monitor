const { Cluster } = require('puppeteer-cluster');
const { getLinks, processLink } = require('./src/utils/utils');

const allResultsSet = new Set();

const urls = [
    'https://www.artwalk.com.br/',
    // 'https://www.correderua.com.br/',
    // 'https://www.lojavirus.com.br/',
    // 'https://www.gdlp.com.br/',
    // 'https://youridstore.com.br/',
];

const storesObj = {
    'correderua': {
        name: 'CDR',
        selectors: {
            links: 'li.span3 > .cn-melhor-imagem:not(.indisponivel)',
            productReference: '.info-principal-produto span[itemprop^="sku"]',
            img: '.conteiner-imagem',
            sneakerName: '.nome-produto.titulo.cor-secundaria',
            price: '.preco-produto.destaque-preco strong[data-sell-price]',
            availableSizes: 'a.atributo-item:not(.indisponivel)',
        },
    },
    'artwalk': {
        name: 'Artwalk',
        selectors: {
            links: '.product-item:not(.produto-indisponivel)',
            productReference: '.productReference',
            img: '.product-image.is-selected, .ns-product-image.is-selected',
            sneakerName: '.info-name-product > .productName',
            price: '.ns-product-price__value',
            availableSizes: '.dimension-Tamanho',
        },
    },
    'gdlp': {
        name: 'GDLP',
        selectors: {
            links: 'li.item.last',
            productReference: '#product-attribute-specs-table tr.last.even > td',
            img: '.magic-slide.mt-active',
            sneakerName: '.product-name > .h1',
            price: '.regular-price > span.price, .special-price > span.price',
            availableSizes: 'option',
        },
    },
    'lojavirus': {
        name: 'LojaVirus',
        selectors: {
            links: '.imagem-spot',
            productReference: '.segura-nome > h1',
            img: 'figure[itemprop^="associatedMedia"]',
            sneakerName: '.fbits-produto-nome.prodTitle.title',
            price: '.precoPor',
            availableSizes: '.valorAtributo:not(.disabled)',
        },
    },
    // 'https://youridstore.com.br/': 'youridstore',
};

const searchFor = [
    // 'converse',
    'air force',
    // 'adidas superstar',
    // 'air max',
    // 'air jordan',
    // 'adidas forum',
    // 'adidas samba',
    // 'adidas gazelle',
    // 'adidas campus',
    // 'adidas ADI2000',
    // 'puma suede',
    // 'puma basket',
    // 'puma 180',
    // 'puma slipstream',
    // 'reebok classic',
    // 'reebok club c',
    // 'vans old skool',
    // 'vans authentic',
    // 'vans sk8',
    // 'vans era',
    // 'vans ultrarange',
    // 'asics gel',
    // 'fila corda'
];

async function mainCluster() {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 5,
        // monitor: true,
        puppeteerOptions: {
            // headless: "new",
            headless: false,
            defaultViewport: {
                width: 1366,
                height: 768,
            },
        }
    });

    async function processResultsCluster(results) {
        await cluster.task(async ({ page, data: { url } }) => {
            try {
                const storeObj = storesObj[url.replace(/.*?\/\/(?:www\.)?(.*?)\.com.*/, '$1')];
                await processLink(page, url, storeObj);
            } catch (error) {
                console.error(`Error processing ${url}:`, error.message);
            }
        });

        for (const url of results) {
            cluster.queue({ url });
        }
        await cluster.idle();
        await cluster.close();
    }

    await cluster.task(async ({ page, data: { url, term } }) => {
        try {
            const storeObj = storesObj[url.replace(/.*?\/\/(?:www\.)?(.*?)\.com.*/, '$1')];
            const links = await getLinks(page, url, storeObj, term);

            links.forEach(link => allResultsSet.add(link));
        } catch (error) {
            console.error(`Error processing ${url} with term ${term}:`, error.message);
            console.error(error.stack);
        }
    });

    for (const url of urls) {
        for (const term of searchFor) {
            cluster.queue({ url, term });
        }
    }
    await cluster.idle();
    console.log(`${allResultsSet.size} total results`);
    await processResultsCluster([...allResultsSet]);
}

module.exports = mainCluster;