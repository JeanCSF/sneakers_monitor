require("dotenv").config();
const axios = require("axios");

const { getSneakerTitle } = require("./titleFunctions");
const { getCategories } = require("./categoryFunctions");
const { getBrands } = require("./brandFunctions");
const { getProductReference } = require("./referenceFunctions");
const { getImg } = require("./imgFunctions");
const { getPrice, getDiscountPrice } = require("./priceFunctions");
const { getAvailableSizes } = require("./sizeFunctions");
const { getColors } = require("./colorFunctions");
const { getCodeFromStore } = require("./storeCodeFunctions");


const { Sneaker: SneakerModel } = require("../../models/Sneaker");

const randomUserAgent = require('random-useragent');

const ExcelJS = require("exceljs");
const path = require("path");
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("Test Data");
worksheet.addRow(["Store", "Product Reference", "Brand", "Sneaker Title", "Categories", "Colors", "Current Price", "Discount Price", "Available Sizes", "Date", "Link", "Image", "Code From Store"]);

async function interceptRequests(page, storeName) {
    await page.setRequestInterception(true);

    page.on('request', (request) => {
        if (request.resourceType() === 'image' ||
            request.resourceType() === 'font' ||
            request.resourceType() === 'video' ||
            request.resourceType() === 'media' ||
            (request.resourceType() === 'stylesheet' &&
                storeName !== 'WallsGeneralStore' &&
                storeName !== 'RatusSkateshop')) {
            request.abort();
        } else {
            request.continue();
        }
    });

    page.on('dialog', async (dialog) => {
        if (dialog) {
            try {
                await dialog.accept();
            } catch (error) {
                console.error('Erro ao aceitar o diálogo:', error.message);
            }
        }
    });
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

async function updateOrCreateSneaker(sneakerObj) {
    const { codeFromStore, store } = sneakerObj;
    try {
        if (process.env.ENVIRONMENT === "dev") {
            if (sneakerObj.availableSizes.length >= 1) {
                worksheet.addRow([sneakerObj.store, sneakerObj.productReference, sneakerObj.brands.join(', '), sneakerObj.sneakerTitle, sneakerObj.categories.join(', '), sneakerObj.colors.join(', '), sneakerObj.currentPrice, sneakerObj.discountPrice, sneakerObj.availableSizes.join(', '), new Date().toLocaleString(), sneakerObj.srcLink, sneakerObj.img, sneakerObj.codeFromStore]);
                const filePath = path.join(__dirname, "test_data/test_data.xlsx");
                await workbook.xlsx.writeFile(filePath);
                console.log(`${sneakerObj.sneakerTitle} added to test data`);
            } else {
                console.log(`${sneakerObj.sneakerTitle} has no available sizes.`);
            }
        } else {
            const existingSneaker = await SneakerModel.findOne({ store, codeFromStore });
            if (existingSneaker) {
                if (!arraysEqual(existingSneaker.availableSizes, sneakerObj.availableSizes) && sneakerObj.availableSizes.length < 1) {
                    await SneakerModel.deleteOne({ _id: existingSneaker._id });
                    console.log(`No more available sizes. ${sneakerObj.sneakerTitle} removed from database.`);
                    return;
                }

                if (!arraysEqual(existingSneaker.availableSizes, sneakerObj.availableSizes) && sneakerObj.availableSizes.length >= 1) {
                    existingSneaker.availableSizes = sneakerObj.availableSizes;
                    await existingSneaker.save();
                    console.log("Available sizes changed.");
                    return;
                }

                if (Number(existingSneaker.currentPrice) !== Number(sneakerObj.currentPrice)) {
                    existingSneaker.currentPrice = sneakerObj.currentPrice;
                    existingSneaker.priceHistory.push({ price: sneakerObj.currentPrice, date: new Date(), });
                    await existingSneaker.save();
                    console.log(`${sneakerObj.sneakerTitle} price changed.`);
                    return;
                }

                console.log(`${sneakerObj.sneakerTitle} is already in the database and has no changes.`);
                return;
            } else {
                if (sneakerObj.availableSizes.length >= 1) {
                    const invalidCategory = sneakerObj.categories.length > 1 && sneakerObj.categories.some(category => {
                        const lowerCaseCategory = category.toLowerCase();
                        return lowerCaseCategory.includes("roupas") ||
                            lowerCaseCategory.includes("bola") ||
                            lowerCaseCategory.includes("saia") ||
                            lowerCaseCategory.includes("meias") ||
                            lowerCaseCategory.includes("gorros");
                    });


                    if (invalidCategory) {
                        console.log(`${sneakerObj.sneakerTitle} is not a sneaker.`);
                    } else {
                        await SneakerModel.create(sneakerObj);
                        console.log(`${sneakerObj.sneakerTitle} added to database.`);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Unexpected error:", error);
    }
}

async function generateRandomUserAgent() {
    let userAgent;

    do {
        userAgent = randomUserAgent.getRandom();
    } while (problematicUserAgents(userAgent));

    return userAgent;
}

function problematicUserAgents(userAgent) {
    const problematicPatterns = [
        /spider/i,
        /scraper/i,
        /msnbot/i,
        /wget/i,
        /crawler/i,
        /bot/i,
        /bots/i,
        /mobi/i,
        /p1000m/i,
        /i800/i,
        /20100101/i,
        /libwww/i,
        /java/i,
        /peach/i,
        /python/i,
        /adobe/i,
        /download/i,
        /downloader/i,
        /superbot/i,
        /webcopier/i,
        /wget/i,
        /playstation/i,
        /wii/i,
        /qupzilla/i,
        /htmlparser/i,
        /validator/i,
        /facebook/i,
        /grub/i,
        /itunes/i,
        /url/i,
        /roku/i,
        /tv/i,
        /search/i,
        /jeeves/i,
        /adsbot/i,
        /googlebot/i,
        /yandex/i,
        /yahoo/i,
        /facebookexternalhit/i,
        /alexa/i,
        /beos/i,
        /os\/2/i,
        /bloglines/i,
        /blackberry/i,
        /nokia/i,
        /vodafone/i,
        /docomo/i,
        /lumia/i,
        /khtml/i,
        /galeon/i,
        /links/i,
        /win95/i,
        /msie/i,
        /sonyericsson/i,
        /sony ericsson/i,
        /presto/i,
        /jaunty/i,
        /seamonkey/i,
        /nextreaming/i,
        /kindle/i,
        /lg/i,
        /minefield/i,
        /emailwolf/i,
        /palmos/i,
        /xenu/i,
        /sunos/i,
        /offline/i,
        /feedfetcher/i,
        /mediapartners/i,
        /konqueror/i,
        /uzbl/i,
        /mot-/i,
        /iceape/i,
        /w3m/i,
        /epiphany/i,
        /minimo/i,
        /portalmmm/i,
        /sec-/i,
        /windows xp/i,
        /midori/i,
        /openbsd/i,
        /trident/i,
        /9a3pre/i,
        /iceweasel/i,
        /avant/i,
        /shadowfox/i,
        /samsung-/i,
        /matbjs/i,
        /debian/i,
        /20110623/i,
        /20110303/i,
        /2009042316/i,
        /netsurf/i,
        /fennec/i,
        /karmic/i,
        /nook/i,
        /20100907/i,
        /20120813/i,
        /20091107/i,
        /dillo/i,
        /clr/i,
        /swiftfox/i,
        /20110622/i,
        /namoroka/i,
        /gregarius/i,
        /freebsd/i,
        /irix/i,
        /phoenix/i,
        /netscape/i,
        /\[en\]/i,
        /csscheck/i,
        /opera\/9\.25/i,
        /headlesschrome/i,
        /20130401/i,
        /20121129/i,
        /20040614/i,
        /helena/i,
        /20120403211507/i,
        /netbsd/i,
        /i686/i,
        /gentoo/i,
    ];

    return problematicPatterns.some(pattern => pattern.test(userAgent.toLowerCase()));
}

async function getSunsetLinks(url) {
    const term = url.split("/").pop();
    const linksSet = new Set();

    try {
        const reqURL = 'https://api.sunsetskateshop.com.br:8443/public/products/getBrandSize/0/183';

        const data = {
            category: "calcados",
            brand: term
        }

        const storeData = {
            "_id": "57a1e6130607512a23cdf437",
            "store": "SUNSET SKATESHOP",
            "cnpj": "10604561000153"
        };

        const headers = {
            'X-Store-Data': JSON.stringify(storeData),
            'Content-Type': 'application/json'
        };

        const response = await axios.post(reqURL, data, { headers });
        const responseData = response.data;
        responseData.data.forEach(item => item.total_itens > 0 && linksSet.add(`https://www.sunsetskateshop.com.br/produto/${item.slugname}`));

        const links = Array.from(linksSet);
        return links;
    } catch (error) {
        console.error("Error in getSunsetLinks:", error);
    }
}

async function getLinks(getLinksObj) {
    const { page, url, storeObj, currentPage } = getLinksObj;
    let retries = 0;
    const maxRetries = 20;
    let userAgent

    while (retries < maxRetries) {
        try {

            if (storeObj.name === "SunsetSkateshop") {
                const links = await getSunsetLinks(url)

                if (links.length > 0) {
                    console.log(`Found ${links.length} links in ${url}`);
                    return links;
                } else {
                    console.log(`No links found in ${url}`);
                    return [];
                }
            }

            if (currentPage > 1) {
                await page.setUserAgent(await generateRandomUserAgent());
                await page.goto(url, { waitUntil: "domcontentloaded" });
                storeObj.name === "Ostore" ? await page.waitForTimeout(2000) : null;
            }

            userAgent = await page.evaluate(() => navigator.userAgent);
            const blocked =
                await page.waitForSelector('#cf-wrapper', { timeout: 3000 }).catch(e => { }) ||
                await page.waitForSelector('h4.please', { timeout: 3000 }).catch(e => { }) ||
                await page.waitForSelector('.descr-reload', { timeout: 3000 }).catch(e => { });
            if (blocked) {
                throw new Error(`\nBlocked User Agent: ${userAgent}`);
            }

            const links = await page.$$eval(storeObj.selectors.links, (containers, storeObj) => {
                if (storeObj.name === "Netshoes") {
                    return containers
                        .filter(container => !container.querySelector('a.fallback-btn'))
                        .map(container => container?.href.replace(',', ''));;
                }

                if (storeObj.name === "RatusSkateshop") {
                    return containers
                        .filter(container => container.querySelector('.item-actions.m-top-half'))
                        .map(container => container.querySelector("a")?.href.replace(',', ''));
                }

                if (storeObj.name === "Sunika") {
                    return containers
                        .map(container => `${container.querySelector("a")?.href.replace(',', '')}`);
                }

                return containers
                    .filter(container => !container.querySelector('.fbits-spot-indisponivel'))
                    .map(container => container.querySelector("a")?.href.replace(',', ''));
            }, storeObj);

            if (links.length > 0) {
                console.log(`Found ${links.length} links in ${url}`);
                return links;
            } else {
                console.log(`No links found in ${url}`);
                return [];
            }
        } catch (error) {
            retries++;
            console.log(`
            \nError getting links from: ${url}
            \nError: ${error}
            \nUser Agent: ${userAgent}`);
        }
    }
    throw new Error(`Failed to get links after ${maxRetries} retries`);
}

async function processLink(processLinkObj) {
    const { page, url, storeObj } = processLinkObj;
    let retries = 0;
    const maxRetries = 20;
    let userAgent

    while (retries < maxRetries) {
        try {
            await page.setUserAgent(await generateRandomUserAgent());
            await page.goto(url, { waitUntil: storeObj.name !== "Sunika" ? "load" : "domcontentloaded" });

            userAgent = await page.evaluate(() => navigator.userAgent);
            const blocked =
                await page.waitForSelector('#cf-wrapper', { timeout: 3000 }).catch(e => { }) ||
                await page.waitForSelector('h4.please', { timeout: 3000 }).catch(e => { }) ||
                await page.waitForSelector('.descr-reload', { timeout: 3000 }).catch(e => { });
            if (blocked) {
                throw new Error(`\nBlocked User Agent: ${userAgent}`);
            }

            const srcLink = url
            const store = storeObj.name.toUpperCase();
            const sneakerTitle = await getSneakerTitle({ page, storeObj });
            const brands = await getBrands(sneakerTitle);
            const categories = await getCategories({ page, sneakerTitle, storeObj, brands });
            const productReference = await getProductReference({ page, storeObj, brands, sneakerTitle });
            const img = await getImg({ page, storeObj, productReference, sneakerLink: srcLink });
            const price = await getPrice({ page, storeObj });
            const discountPrice = await getDiscountPrice({ page, storeObj });
            const availableSizes = await getAvailableSizes({ page, storeObj });
            const colors = await getColors({ page, storeObj, sneakerTitle, productReference });
            const codeFromStore = await getCodeFromStore({ page, url, storeObj });

            const sneakerObj = {
                srcLink,
                productReference,
                store,
                img,
                sneakerTitle,
                categories,
                brands,
                colors,
                currentPrice: price,
                discountPrice: discountPrice,
                priceHistory: [{ price, date: new Date() }],
                availableSizes,
                codeFromStore
            };

            if ((availableSizes !== null && availableSizes.length > 0) &&
                !sneakerTitle.toLowerCase().includes('calça') ||
                !sneakerTitle.toLowerCase().includes('camisa') ||
                !sneakerTitle.toLowerCase().includes('camiseta') ||
                !sneakerTitle.toLowerCase().includes('bolsa')) {
                await updateOrCreateSneaker(sneakerObj);

                storeObj.name === "CDR" ? await page.waitForTimeout(5000) : null;
                return;
            } else {
                console.log(`Not a sneaker or not available sizes: ${sneakerTitle} / ${availableSizes}`);
                return;
            }
        } catch (error) {
            storeObj.name === "CDR" ? await page.waitForTimeout(5000) : null;
            retries++;
            console.log(`
            \nError processing link: ${url}
            \nError: ${error}
            \nUser Agent: ${userAgent}`);
        }
    }
    throw new Error(`Failed to process link after ${maxRetries} retries \nUser agent: ${userAgent}`);
}

module.exports = {
    getLinks,
    processLink,
    interceptRequests,
    generateRandomUserAgent,
};
