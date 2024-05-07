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
    'https://www.correderua.com.br/',
    // 'https://www.artwalk.com.br/',
    // 'https://www.gdlp.com.br/',
    // 'https://www.lojavirus.com.br/',
    // 'https://youridstore.com.br/',
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
            img: '.produto.easyzoom',
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
            // 'fila',
            // 'nike-ebernon',
            // 'mad-rats',
            // '02-nike-court-borough',
            // '01-air-max',
            // '2-m2k',
            // 'air-force',
            // 'nike-sb',
            // 'hocks',
            // '01-qix-20410829',
            // '1-redley',
            // 'adidas',
            // 'puma',
            // 'dc-shoes',
            // 'air-max-correlate-e-command',
            // 'new-balance-22697012',
            // 'nike-blazer',
            'nike-dunk',
            'chinelo-20723668',
        ]
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
            links: '.fbits-item-lista-spot ',
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

async function mainCluster() {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 20,
        monitor: true,
        puppeteerOptions: {
            args: [
                '--no-sandbox',
                '--no-first-run',
                '--disable-gpu',
                '--start-maximized',
            ],
            defaultViewport: null,
            headless: 'shell',
            // headless: false,
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
        await cluster.close();
    }

}

module.exports = mainCluster;