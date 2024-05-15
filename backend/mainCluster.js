const { Cluster } = require('puppeteer-cluster');
const { getLinks, processLink, interceptRequests } = require('./src/utils/utils');
const { getSearchTerms, getNumOfPages, getCurrentPage } = require('./src/utils/pageFunctions');

const allResultsSet = new Set();
const allSearchTermsSet = new Set();

const urls = [
    // 'https://www.netshoes.com.br/',
    // 'https://www.sunsetskateshop.com.br/',
    // 'https://www.ostore.com.br/',
    // 'https://www.wallsgeneralstore.com.br/',
    // 'https://www.ratusskateshop.com.br/',
    // 'https://www.maze.com.br/',
    // 'https://www.sunika.com.br/',
    // 'https://www.correderua.com.br/',
    // 'https://www.artwalk.com.br/',
    // 'https://www.gdlp.com.br/',
    // 'https://www.lojavirus.com.br/',
    'https://youridstore.com.br/',
];

const storesObj = {
    netshoes: {
        name: 'Netshoes',
        baseUrl: 'https://www.netshoes.com.br/',
        selectors: {
            links: '.wrapper[itemscope][data-quickview] a, .items-wrapper .item-card__description',
            productReference: '.wishlist__heart',
            img: 'figure.photo-figure',
            sneakerName: 'section.short-description h1, .product-title h1',
            price: '.ncard-hint--info p',
            discountPrice: '.current-price, div.default-price strong, .price__currency',
            availableSizes: 'ul.radio-options li:not(.unavailable) > a.product-item, ul.product__size--list li:not(.unavailable) > a',
            pagination: '.items-info.half span, .info-list__quantity',
            colors: '.tcell .sku-select-title, .product__color--selected span',
            categories: 'head script[type="text/javascript"]:not(#vwoCode, #gtm-init)',
        },
        searchFor: [
            'adidas',
            'asics',
            'kappa',
            'mizuno',
            'new balance',
            'nike',
            'olympikus',
            'puma',
            'saucony'
        ]
    },
    sunsetskateshop: {
        name: 'SunsetSkateshop',
        baseUrl: 'https://www.sunsetskateshop.com.br/',
        selectors: {
            links: '.products__item.ng-scope',
            productReference: '.product__description',
            img: '.product__image-container',
            sneakerName: 'h2.product__title',
            price: 'h3.product__price',
            availableSizes: '.product__option label[ng-if="stock.items_number > 0"]',
            pagination: '',
            colors: ''
        },
        searchFor: [
            'adidas',
            'cariuma',
            'columbia',
            'dc',
            'fila',
            'new balance',
            'nike nsw',
            'nike sb',
            'oakley',
            'tesla',
            'the north face',
            'vans',
            'ous'
        ]
    },
    ostore: {
        name: 'Ostore',
        baseUrl: 'https://www.ostore.com.br/',
        selectors: {
            links: '.prateleira-full-site.n4colunas ul > li > .box-item.text-center:not(.product-off)',
            productReference: '.productDescription',
            img: '#image',
            sneakerName: '.productName',
            price: '.skuBestPrice',
            availableSizes: '.select-itens > div:not(.unavailable)',
            pagination: '.resultado-busca-numero > .value',
            colors: '.item.first-item > a',
            storeSku: '.skuReference'
        },
        searchFor: [
            'adidas',
            'asics',
            'converse',
            'fila',
            'new balance',
            'nike',
            'puma',
            'reebok',
            'rider',
            'vans',
        ]
    },
    wallsgeneralstore: {
        name: 'WallsGeneralStore',
        baseUrl: 'https://www.wallsgeneralstore.com.br/',
        selectors: {
            links: '.product-box.flex.flex-column.justify-between:not(.not-available)',
            productReference: 'span[itemprop="sku"]',
            img: '#imgView',
            sneakerName: '.product-colum-right h1',
            price: '#variacaoPreco',
            availableSizes: 'ul.lista_cor_variacao li:not(.sem_estoque )',
            pagination: '',
            colors: '#caracteristicas'
        },
        searchFor: [
            'asics',
            'converse',
            'new balance',
            'nike sb',
            'vans',
            'ous',
            'piet',
        ]
    },
    ratusskateshop: {
        name: 'RatusSkateshop',
        baseUrl: 'https://www.ratusskateshop.com.br/',
        selectors: {
            links: '.js-product-container.js-quickshop-container.js-quickshop-has-variants',
            productReference: 'div[data-store].description.product-description.product-description-desktop',
            img: '.js-desktop-zoom.p-relative.d-block, .js-mobile-zoom.p-relative.d-block',
            sneakerName: '#product-name',
            price: '#price_display',
            availableSizes: '#product_form  span.btn-variant-content:not(.hintup-nostock)',
            pagination: '',
            colors: 'div[data-variant="Cor"] > label.variant-label > strong.js-insta-variation-label',
            storeSku: 'script[data-component="structured-data.page"]'
        },
        searchFor: [
            'Cariuma',
            'Converse',
            'Dc',
            'New Balance',
            'Nike Sb',
            'Ous',
            'Tesla',
            'Vans',
        ]
    },
    maze: {
        name: 'Maze',
        baseUrl: 'https://www.maze.com.br/',
        selectors: {
            links: '.ui.card.produto.product-in-card.in-stock',
            productReference: '.row.desc_info > .column_1',
            img: 'a[data-standard][data-video-url]',
            sneakerName: '#produto-nome',
            price: '#preco',
            availableSizes: '.ui.variacao.check:not(.sold) > button.ui.basic.button',
            pagination: '#nextPage',
            colors: '',
            storeSku: 'h6.codProduto'
        },
        searchFor: [
            'nike',
            'adidas',
            'vans',
            'puma',
            'converse',
            'new balance',
        ]
    },
    sunika: {
        name: 'Sunika',
        baseUrl: 'https://www.sunika.com.br/',
        selectors: {
            links: 'li.purchasable',
            productReference: '#ld-json',
            img: '#ld-json',
            sneakerName: '.information div .name',
            price: '.priceContainer > strong > span',
            availableSizes: '.options > label:not(.unavailable) > span > b',
            pagination: '.pagination',
            colors: 'h2.cor'
        },
        searchFor: [
            'adidas',
            'asics',
            'cariuma',
            'clarks',
            'converse',
            'crocs',
            'fila',
            'golden goose',
            'hoka',
            'mizuno',
            'new balance',
            'on running',
            'reebok',
            'superga',
            'under armour',
            'vans',
            'vert',
        ]
    },
    correderua: {
        name: 'CDR',
        baseUrl: 'https://www.correderua.com.br/',
        selectors: {
            links: 'li.span3 > .cn-melhor-imagem:not(.indisponivel)',
            productReference: '.info-principal-produto span[itemprop^="sku"]',
            img: '.conteiner-imagem',
            sneakerName: '.nome-produto.titulo.cor-secundaria',
            price: '.preco-produto.destaque-avista strong[data-sell-price]',
            discountPrice: 'span.desconto-a-vista strong',
            availableSizes: 'a.atributo-item:not(.indisponivel)',
            pagination: '.pagination ul li a',
            colors: '',
            storeSku: '.acoes-flutuante > .acoes-produto[data-variacao-id=""]'
        },
        searchFor: [
            'fila',
            'nike-ebernon',
            'mad-rats',
            '02-nike-court-borough',
            '01-air-max',
            '2-m2k',
            'air-force',
            'nike-sb',
            'hocks',
            '01-qix-20410829',
            '1-redley',
            'adidas',
            'puma',
            'dc-shoes',
            'air-max-correlate-e-command',
            'new-balance-22697012',
            'nike-blazer',
            'nike-dunk',
            'chinelo-20723668',
        ]
    },
    artwalk: {
        name: 'Artwalk',
        baseUrl: 'https://www.artwalk.com.br/',
        selectors: {
            links: '.vtex-product-summary-2-x-container.vtex-product-summary-2-x-containerNormal',
            productReference: '.vtex-product-identifier-0-x-product-identifier__value',
            img: 'img.vtex-store-components-3-x-productImageTag--products-list--main',
            sneakerName: 'h1 span.vtex-store-components-3-x-productBrand',
            price: 'span.vtex-product-price-1-x-sellingPrice',
            availableSizes: 'div.valueWrapper.vtex-store-components-3-x-skuSelectorItem:not(.vtex-store-components-3-x-unavailable)',
            pagination: '.vtex-search-result-3-x-totalProducts--layout',
            colors: '.artwalk-store-theme-7-x-current_color_selected',
            storeSku: 'meta[property="product:sku"]'
        },
        searchFor: [
            'tenis/adidas',
            'tenis/nike',
            'tenis/puma',
            'tenis/jordan',
            'tenis/converse',
            'tenis/vans',
            'tenis/under-armour',
            'tenis/fila',
            'tenis/new-balance',
            'tenis/veja',
            'calcados/sandalias/crocs',
            'calcados/sandalias/rider',
            'calcados/chinelos/rider',
            'calcados/chinelos/jordan',
            'calcados/chinelos/adidas',
            'calcados/chinelos/nike',
        ]
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
            colors: '.tab-content .std',
            storeSku: 'head script:not([async],[type])',
        },
        searchFor: [
            'calcados/adidas',
            'calcados/asics',
            'calcados/converse',
            'calcados/crocs',
            'calcados/fila',
            'calcados/mizuno',
            'calcados/new-balance',
            'calcados/nike',
            'marca/on',
            'calcados/ous',
            'calcados/puma',
            'calcados/reebok',
            'calcados/rider',
            'calcados/vans',
            'calcados/hoka',
        ]
    },
    lojavirus: {
        name: 'LojaVirus',
        baseUrl: 'https://www.lojavirus.com.br/',
        selectors: {
            links: '.fbits-item-lista-spot > div:not(.fbits-spot-indisponivel)',
            productReference: '.paddingbox',
            img: '#galeria > a',
            sneakerName: '.fbits-produto-nome.prodTitle.title',
            price: '.precoPor',
            availableSizes: '.valorAtributo:not(.disabled)',
            pagination: '.fbits-paginacao ul li.pg a',
            colors: '.atributos-cor > div[data-nomeatributo="Cor"] div > .selected .nomeCor',
            storeSku: '.fbits-sku',
        },
        searchFor: [
            'converse-all-star-tipo-tenis',
            'vans-tipo-tenis',
            'veja',
            'nike-tipo-tenis',
            'new-balance'
        ]
    },
    youridstore: {
        name: 'YourID',
        baseUrl: 'https://www.youridstore.com.br/',
        selectors: {
            links: 'h2.product-name',
            productReference: '.sku > .value',
            img: '#zoom1',
            sneakerName: 'h1',
            price: '.price',
            availableSizes: '#configurable_swatch_c2c_tamanho li',
            pagination: '#narrow-by-list > dd',
            colors: '#select_label_c2c_cor',
            storeSku: '',
        },
        searchFor: [
            'tenis/tenis-adidas.html',
            'tenis/tenis-asics.html',
            'tenis/sandalia-crocs.html',
            'tenis/tenis-converse.html',
            'tenis/tenis-fila.html',
            'tenis/tenis-hoka.html',
            'tenis/tenis-air-jordan.html',
            'tenis/tenis-lacoste.html',
            'tenis/tenis-mizuno.html',
            'tenis/tenis-new-balance.html',
            'tenis/tenis-nike.html',
            'tenis/on-running.html',
            'tenis/tenis-puma.html',
            'tenis/tenis-reebok-classic.html',
            'tenis/tenis-ous.html',
            'tenis/tenis-vans.html'
        ]
    }
};

async function mainCluster() {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 15,
        monitor: true,
        puppeteerOptions: {
            args: [
                '--no-sandbox',
                '--no-first-run',
                '--disable-gpu',
                '--start-maximized',
            ],
            defaultViewport: null,
            // headless: 'shell',
            headless: false,
            // slowMo: 100,
        }
    });
    await cluster.task(async ({ page, data: { url } }) => {
        try {
            const storeObj = storesObj[url.replace(/.*?\/\/(?:www\.)?(.*?)\.com.*/, '$1')];
            await interceptRequests(page, storeObj.name);
            const searchUrls = getSearchTerms({ url, searchFor: storeObj.searchFor });
            searchUrls.forEach(link => allSearchTermsSet.add(link));

        } catch (error) {
            console.error(`Error processing ${url}:`, error.message);
        }
    });

    for (const url of urls) {
        await cluster.queue({ url: url });
    }

    await cluster.idle();
    await getLinksCluster([...allSearchTermsSet]);

    async function getLinksCluster(searchUrls) {
        await cluster.task(async ({ page, data: { url } }) => {
            try {
                const storeObj = storesObj[url.replace(/.*?\/\/(?:www\.)?(.*?)\.com.*/, '$1')];

                await interceptRequests(page, storeObj.name);
                const currentPage = await getCurrentPage({ url, storeName: storeObj.name });

                if (currentPage === 1) {
                    const pageNumbers = await getNumOfPages({ page, storeName: storeObj.name, storeSelectors: storeObj.selectors, url });

                    if (pageNumbers > 1) {
                        for (let i = 2; i <= pageNumbers; i++) {
                            switch (storeObj.name) {
                                case "CDR":
                                case "LojaVirus":
                                    await cluster.queue({ url: `${url}?pagina=${i}` });
                                    break;

                                case "GDLP":
                                    await cluster.queue({ url: `${url}/page/${i}` });
                                    break;

                                case "Ostore":
                                    await cluster.queue({ url: `${url}#${i}` });
                                    break;

                                case "Netshoes":
                                    await cluster.queue({ url: `${url}&page=${i}` });
                                    break;

                                case "Sunika":
                                    await cluster.queue({ url: `${url}?pg=${i}` });
                                    break;

                                case "Maze":
                                    await cluster.queue({ url: `${url}&pageNumber=${i}` });
                                    break;

                                case "Artwalk":
                                    await cluster.queue({ url: `${url}?page=${i}` });
                                    break;

                                case "YourID":
                                    await cluster.queue({ url: `${url}?p=${i}` });
                                    break;

                                default:
                                    break;
                            }
                        }
                    }
                }

                const links = await getLinks({ page, url, storeObj, currentPage });
                if (links !== undefined) {
                    links.forEach(link => allResultsSet.add(link));
                }

            } catch (error) {
                console.error(`Error getting links from ${url}:`, error.message);
            }
        });

        for (const url of searchUrls) {
            cluster.queue({ url });
        }

        await cluster.idle();
        console.log(`${allResultsSet.size} total results`);
        await processResultsCluster([...allResultsSet]);
    }

    async function processResultsCluster(results) {
        await cluster.task(async ({ page, data: { url } }) => {
            try {
                const storeObj = storesObj[url.replace(/.*?\/\/(?:www\.)?(.*?)\.com.*/, '$1')];
                await interceptRequests(page, storeObj.name);
                await processLink({ page, url, storeObj });
            } catch (error) {
                console.error(`Error processing ${url}:`, error.message);
            }
        });

        for (const url of results) {
            cluster.queue({ url });
        }
        await cluster.idle();
    }

    await cluster.close();
}

module.exports = mainCluster;