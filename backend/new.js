const { Cluster } = require('puppeteer-cluster');
const { arraysEqual, updateOrCreateSneaker, createSearchUrl, generalScrape } = require('./src/utils/utils');
const urls = [
    'https://www.correderua.com.br/',
    'https://www.artwalk.com.br/',
    'https://gdlp.com.br/',
    'https://www.lojavirus.com.br/',
    // // 'https://youridstore.com.br/',
];

const storesObj = {
    'https://www.correderua.com.br/': {
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
    'https://www.artwalk.com.br/': {
        name: 'Artwalk',
        selectors: {
            links: '.product-item-container',
            productReference: '.productReference',
            img: '.ns-product-image.is-selected',
            sneakerName: '.info-name-product > .productName',
            price: '.ns-product-price__value',
            availableSizes: '.dimension-Tamanho:not(.item_unavaliable)',
        },
    },
    'https://gdlp.com.br/': {
        name: 'GDLP',
        selectors: {
            links: 'li.item.last',
            productReference: '#product-attribute-specs-table tr.last.even > td',
            img: 'figure',
            sneakerName: '.product-name > .h1',
            price: '.regular-price > span',
            availableSizes: 'option',
        },
    },
    'https://www.lojavirus.com.br/': {
        name: 'LojaVirus',
        selectors: {
            links: '.imagem-spot',
            productReference: '.segura-nome h1',
            img: 'figure[itemprop^="associatedMedia"]',
            sneakerName: '.fbits-produto-nome.prodTitle.title',
            price: '.precoPor',
            availableSizes: '.valorAtributo:not(.disabled)',
        },
    },
    // 'https://youridstore.com.br/': 'youridstore',
};


const searchFor = [
    'air force',
    'air max 1',
    'air max 90',
    'air max 95',
    'air max 97',
    'air max tn',
    'air jordan 1',
    'air jordan 2',
    'air jordan 3',
    'air jordan 4',
    'air jordan 5',
    'adidas forum',
    'adidas samba',
    'adidas gazelle',
    'adidas superstar',
    'adidas campus',
    'adidas ADI2000',
    'puma suede',
    'puma basket',
    'puma 180',
    'puma slipstream',
    'reebok classic',
    'reebok club c',
    'vans old skool',
    'vans sk8',
    'vans authentic',
    'vans era',
    'vans ultrarange',
    'asics gel',
];
(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 20,
        // monitor: true,
        puppeteerOptions: {
            headless: "new",
        }
    });

    await cluster.task(async ({ page, data: { url, term } }) => {
        console.log(`================Início de processamento de ${url} com o termo ${term}==============`);
        try {
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.goto(createSearchUrl(url, term), { waitUntil: 'domcontentloaded' }),
            ]);
            await generalScrape(page, term, storesObj[url])
        } catch (error) {
            console.error(`Erro ao processar ${url} com o termo ${term}:`, error.message);
            console.error(error.stack);
        }
        console.log(`================Fim de processamento de ${url} com o termo ${term}==============`);
    });

    for (const url of urls) {
        for (const term of searchFor) {
            cluster.queue({ url, term });
        }
    }
    await cluster.idle();
    await cluster.close();

})();