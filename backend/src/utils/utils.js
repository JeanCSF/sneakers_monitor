const { Sneaker: SneakerModel } = require("../../models/Sneaker");
const ExcelJS = require('exceljs');
const path = require('path');
const pup = require("puppeteer");
const randomUserAgent = require('random-useragent');

const onTest = true;
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Test Data');
worksheet.addRow(['Store', 'Product Reference', 'Sneaker Name', 'Current Price', 'Discount Price', 'Available Sizes', 'Date', 'Link', 'Image']);

const scrollToEnd = async (page) => {
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
};

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

async function updateOrCreateSneaker(sneakerObj) {
    const { productReference, store } = sneakerObj;
    try {
        if (onTest) {
            worksheet.addRow([sneakerObj.store, sneakerObj.productReference, sneakerObj.sneakerName, sneakerObj.currentPrice, sneakerObj.discountPrice, sneakerObj.availableSizes.join(', '), new Date().toLocaleString(), sneakerObj.srcLink, sneakerObj.img]);
            const filePath = path.join(__dirname, 'test_data.xlsx');
            await workbook.xlsx.writeFile(filePath);
            console.log(`Dados salvos em ${filePath}`);
        } else {
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
        }
    } catch (error) {
        console.error('Erro ao chamar o endpoint da API:', error);
    }
}

function createSearchUrl(url, term) {
    if (url.includes('correderua')) {
        return `${url}buscar?q=${term.replace(/\s+/g, '+').toLowerCase()}`;
    } else if (url.includes('gdlp')) {
        return `${url}catalogsearch/result/?q=${term.replace(/\s+/g, '+').toLowerCase()}`;
    } else if (url.includes('artwalk')) {
        return `${url}${term.replace(/\s+/g, '-').toLowerCase()}?O=OrderByPriceASC&PS=24`;
    } else if (url.includes('lojavirus')) {
        return `${url}busca?busca=${term.replace(/\s+/g, '-').toLowerCase()}`;
    } else {
        console.error('URL não reconhecida:', url);
        return url;
    }
}

async function generalScrape(searchPage, term, storeObj) {
    try {
        let previousHeight = 0;
        while (true) {
            await scrollToEnd(searchPage);
            await searchPage.waitForTimeout(1000);
            const currentHeight = await searchPage.evaluate(() => document.body.scrollHeight);
            if (currentHeight === previousHeight) {
                break;
            }
            previousHeight = currentHeight;
        }

        const links = await searchPage.$$eval(storeObj.selectors.links, el => el.map(container => container.querySelector('a').href));
        if (links.length !== 0) {
            for (const link of links) {
                const browser = await pup.launch({ headless: "new" });
                const page = await browser.newPage();
                await page.setUserAgent(randomUserAgent.getRandom());
                await page.goto(link, { waitUntil: 'domcontentloaded' });

                const srcLink = link;

                await page.waitForSelector(storeObj.selectors.productReference, { waitUntil: 'domcontentloaded', timeout: 0 });
                const productReference = storeObj.name.toLowerCase().includes('lojavirus') ?
                    await page.$eval(storeObj.selectors.productReference, el => el.innerText.match(/\b[A-Z]+\d+-\d+\b/).toString())
                    : await page.$eval(storeObj.selectors.productReference, el => el.innerText);

                const store = storeObj.name;

                await page.waitForSelector(storeObj.selectors.img, { waitUntil: 'domcontentloaded', timeout: 0 });
                const img = await page.$eval(storeObj.selectors.img, el => el.querySelector('img').src);

                await page.waitForSelector(storeObj.selectors.sneakerName, { waitUntil: 'domcontentloaded', timeout: 0 });
                const sneakerName = await page.$eval(storeObj.selectors.sneakerName, el => el.innerText);

                await page.waitForSelector(storeObj.selectors.price, { waitUntil: 'domcontentloaded', timeout: 0 });
                const price = await page.$eval(storeObj.selectors.price, el => {
                    const sellPriceAttribute = el.getAttribute('data-sell-price');

                    const priceText = el.innerText;
                    const match = priceText.match(/R\$\s*([^\n]+)$/);
                    if (match) {
                        return match[1];
                    }
                    return sellPriceAttribute;
                });

                const discountPrice = storeObj.name.toLowerCase().includes('cdr') ?
                    await page.$eval('span.desconto-a-vista strong', el => {
                        const priceText = el.innerText;
                        const match = priceText.match(/R\$\s*([^\n]+)$/);
                        if (match) {
                            return match[1];
                        }
                        return null;
                    }) : null;

                await page.waitForSelector(storeObj.selectors.availableSizes, { waitUntil: 'domcontentloaded', timeout: 0 });
                const availableSizes = await page.$$eval(storeObj.selectors.availableSizes, els => {
                    return els
                        .map(el => el.innerText.trim())
                        .filter(text => text.trim() !== 'Selecione...')
                        .filter(text => /\d+/.test(text));
                });

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
                    await updateOrCreateSneaker(sneakerObj);
                } else {
                    console.log('O modelo não corresponde à pesquisa. Não será salvo no banco de dados.');
                }

                await browser.close();
            }
        } else {
            console.error(`Nenhum resultado para ${term} na loja ${storeObj.name}`);
        }
        console.log('Scraping concluído com sucesso.');
    } catch (error) {
        console.error('Erro durante o scraping:', error.message);
        console.error(error.stack);
    }
}

module.exports = { arraysEqual, updateOrCreateSneaker, createSearchUrl, generalScrape };