const { Cluster } = require('puppeteer-cluster');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(pluginStealth());

const { getLinks, processLink } = require('./src/utils/utils');

const allResultsSet = new Set();

const urls = [
    'https://www.sunsetskateshop.com.br/',
    'https://www.ostore.com.br/',
    'https://www.wallsgeneralstore.com.br/',
    'https://www.ratusskateshop.com.br/',
    'https://www.maze.com.br/',
    'https://www.sunika.com.br/',
    'https://www.artwalk.com.br/',
    'https://www.correderua.com.br/',
    'https://www.gdlp.com.br/',
    'https://www.lojavirus.com.br/',
    // 'https://youridstore.com.br/',
];

const storesObj = {
    sunsetskateshop: {
        name: 'SunsetSkateshop',
        baseUrl: 'https://www.sunsetskateshop.com.br/',
        selectors: {
            links: '.products__item.ng-scope',
            productReference: '.product__description.ng-scope',
            img: '.product__image-container',
            sneakerName: 'h2.product__title',
            price: 'h3.product__price',
            availableSizes: '.product__option label[ng-if="stock.items_number > 0"]',
            pagination: '',
        }
    },
    ostore: {
        name: 'Ostore',
        baseUrl: 'https://www.ostore.com.br/',
        selectors: {
            links: 'span.price',
            productReference: '.skuReference',
            img: '#image',
            sneakerName: '.productName',
            price: '.skuBestPrice',
            availableSizes: '.select-itens > div:not(.unavailable)',
            pagination: '.resultado-busca-numero span.value',
        }
    },
    wallsgeneralstore: {
        name: 'WallsGeneralStore',
        baseUrl: 'https://www.wallsgeneralstore.com.br/',
        selectors: {
            links: '.product-box.flex.flex-column.justify-between:not(.not-available)',
            productReference: '',
            img: '#container_thumb',
            sneakerName: '.product-colum-right h1',
            price: '#variacaoPreco',
            availableSizes: 'ul.lista_cor_variacao li:not(.sem_estoque )',
            pagination: '',
        }
    },
    ratusskateshop: {
        name: 'RatusSkateshop',
        baseUrl: 'https://www.ratusskateshop.com.br/',
        selectors: {
            links: '.js-product-container.js-quickshop-container.js-quickshop-has-variants',
            productReference: '',
            img: '.js-desktop-zoom.p-relative.d-block, .js-mobile-zoom.p-relative.d-block',
            sneakerName: '#product-name',
            price: '#price_display',
            availableSizes: '#product_form  span.btn-variant-content:not(.hintup-nostock)',
            pagination: '',
        }
    },
    maze: {
        name: 'Maze',
        baseUrl: 'https://www.maze.com.br/',
        selectors: {
            links: '.ui.card.produto.product-in-card.in-stock',
            productReference: '.row.desc_info > .column_1',
            img: '.produto.easyzoom',
            sneakerName: '#produto-nome',
            price: '#preco',
            availableSizes: '.ui.variacao.check:not(.sold) > button.ui.basic.button',
            pagination: '',
        }
    },
    sunika: {
        name: 'Sunika',
        baseUrl: 'https://www.sunika.com.br/',
        selectors: {
            links: 'li.purchasable',
            productReference: '',
            img: '.big-list',
            sneakerName: '.information div .name',
            price: '.priceContainer > strong > span',
            availableSizes: '.options > label:not(.unavailable) > span > b',
            pagination: '',
        }
    },
    correderua: {
        name: 'CDR',
        baseUrl: 'https://www.correderua.com.br/',
        selectors: {
            links: 'li.span3 > .cn-melhor-imagem:not(.indisponivel)',
            productReference: '.info-principal-produto span[itemprop^="sku"]',
            img: '.conteiner-imagem',
            sneakerName: '.nome-produto.titulo.cor-secundaria',
            price: '.preco-produto.destaque-preco strong[data-sell-price]',
            availableSizes: 'a.atributo-item:not(.indisponivel)',
            pagination: '.pagination ul li a',
        },
    },
    artwalk: {
        name: 'Artwalk',
        baseUrl: 'https://www.artwalk.com.br/',
        selectors: {
            links: '.product-item:not(.produto-indisponivel)',
            productReference: '.productReference',
            img: '.product-image.is-selected, .ns-product-image.is-selected',
            sneakerName: '.info-name-product > .productName',
            price: '.ns-product-price__value',
            availableSizes: '.dimension-Tamanho',
            pagination: '',
        },
    },
    gdlp: {
        name: 'GDLP',
        baseUrl: 'https://www.gdlp.com.br/',
        selectors: {
            links: 'li.item.last',
            productReference: '#product-attribute-specs-table tr.last.even > td',
            img: '.magic-slide.mt-active',
            sneakerName: '.product-name > .h1',
            price: '.regular-price > span.price, .special-price > span.price',
            availableSizes: 'option',
            pagination: '.amount--has-pages',
        },
    },
    lojavirus: {
        name: 'LojaVirus',
        baseUrl: 'https://www.lojavirus.com.br/',
        selectors: {
            links: '.imagem-spot',
            productReference: '.segura-nome > h1',
            img: 'figure[itemprop^="associatedMedia"]',
            sneakerName: '.fbits-produto-nome.prodTitle.title',
            price: '.precoPor',
            availableSizes: '.valorAtributo:not(.disabled)',
            pagination: '.fbits-paginacao ul li.pg a',
        },
    },
    // 'https://youridstore.com.br/': 'youridstore',
};

const searchFor = [
    // 'converse',
    // 'fila',
    // 'air force',
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
    'vans sk8',
    // 'vans era',
    // 'vans ultrarange',
    // 'asics gel',
    // 'fila corda'
];

async function mainCluster() {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 5,
        monitor: true,
        puppeteerOptions: {
            // headless: "new",
            headless: false,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--disable-gpu',  
              '--window-size=1366,768',
              '--start-maximized',
              '--no-first-run',
            ],
            defaultViewport: {
                width: 1366,
                height: 768,
            },
            executablePath: puppeteerExtra.executablePath(),
        }
    });

    async function processResultsCluster(results) {
        await cluster.task(async ({ page, data: { url } }) => {
            try {
                const storeObj = storesObj[url.replace(/.*?\/\/(?:www\.)?(.*?)\.com.*/, '$1')];
                await processLink(page, url, storeObj);
            } catch (error) {
                console.error(`Error processing ${url}:`, error.message);
                console.error(error.stack);
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
            if (links !== undefined) {
                links.forEach(link => allResultsSet.add(link));
            }
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