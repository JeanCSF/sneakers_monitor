const { Sneaker: SneakerModel } = require("../../models/Sneaker");
const { Decimal128 } = require("mongodb");
const randomUserAgent = require('random-useragent');
const ExcelJS = require("exceljs");
const path = require("path");
const onTest = false;
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("Test Data");
worksheet.addRow(["Store", "Product Reference", "Sneaker Name", "Current Price", "Discount Price", "Available Sizes", "Date", "Link", "Image"]);

async function scrollToEnd(page) {
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
};

async function scrollPage(page) {
    let previousHeight = 0;
    while (true) {
        await scrollToEnd(page);
        await page.waitForTimeout(1000);
        const currentHeight = await page.evaluate(
            () => document.body.scrollHeight
        );
        if (currentHeight === previousHeight) {
            break;
        }
        previousHeight = currentHeight;
    }
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function strToDecimal(str) {
    const cleanedStr = str.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanedStr);
}

async function updateOrCreateSneaker(sneakerObj) {
    const { productReference, store } = sneakerObj;
    try {
        if (onTest) {

            worksheet.addRow([sneakerObj.store, sneakerObj.productReference, sneakerObj.sneakerName, sneakerObj.currentPrice, sneakerObj.discountPrice, sneakerObj.availableSizes.join(', '), new Date().toLocaleString(), sneakerObj.srcLink, sneakerObj.img]);
            const filePath = path.join(__dirname, "test_data.xlsx");
            await workbook.xlsx.writeFile(filePath);
            console.log(`Sneaker ${sneakerObj.sneakerName} added to test data: ${filePath}`);
        } else {
            const existingSneaker = await SneakerModel.findOne({ store, productReference });
            if (existingSneaker) {
                if (!arraysEqual(existingSneaker.availableSizes, sneakerObj.availableSizes)) {
                    existingSneaker.availableSizes = sneakerObj.availableSizes;
                }

                if (existingSneaker.currentPrice !== sneakerObj.currentPrice) {
                    existingSneaker.currentPrice = sneakerObj.currentPrice;
                    existingSneaker.priceHistory.push({ price: sneakerObj.currentPrice, date: new Date(), });
                }

                await existingSneaker.save();
                console.log("Sneaker updated in database.");
            } else {
                await SneakerModel.create(sneakerObj);
                console.log("Sneaker successfully added to database.");
            }
        }
    } catch (error) {
        console.error("Unexpected error:", error);
    }
}

function createSearchUrl(url, term) {
    if (url.includes("correderua")) {
        return `${url}buscar?q=${term.replace(/\s+/g, "+").toLowerCase()}`;
    } else if (url.includes("gdlp")) {
        return `${url}catalogsearch/result/?q=${term.replace(/\s+/g, "+").toLowerCase()}`;
    } else if (url.includes("artwalk")) {
        return `${url}${encodeURIComponent(term).toLowerCase()}?O=OrderByPriceASC&PS=24`;
    } else if (url.includes("lojavirus")) {
        return `${url}busca?busca=${term.replace(/\s+/g, "-").toLowerCase()}`;
    } else {
        console.error("Invalid URL:", url);
        return url;
    }
}

async function interceptRequests(page) {
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (
            request.resourceType() === 'image' ||
            request.resourceType() === 'font' ||
            request.resourceType() === 'video' ||
            request.resourceType() === 'media'
        ) {
            request.abort();
        } else {
            request.continue();
        }
    });
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
}

async function getNumOfPages(page, storeName, storeSelectors) {
    try {
        switch (storeName) {
            case "LojaVirus":
                return await page.evaluate((selectors) => {
                    const links = document.querySelectorAll(selectors.pagination);
                    if (links.length >= 2) {
                        return parseInt(links[links.length - 2].innerText);
                    }
                    return null;
                }, storeSelectors);
            case "GDLP":
                const total = await page.evaluate((selectors) => {
                    const element = document.querySelector(selectors.pagination);
                    return element ? element.textContent.trim().split(' ')[2] : null;
                }, storeSelectors);
                return total ? Math.ceil(total / 40) : null;
            default:
                return null;
        }
    } catch (error) {
        console.error("Error getting num of pages:", error);
        console.error(error.stack);
    }
}

async function getLinks(page, url, storeObj, term) {
    try {
        await page.setUserAgent(randomUserAgent.getRandom());
        await interceptRequests(page);
        await page.goto(createSearchUrl(url, term), { waitUntil: 'domcontentloaded' });

        await scrollPage(page);

        const links = await page.$$eval(storeObj.selectors.links, (containers) => {
            return containers.map(container => container.querySelector("a").href);
        });
        const pageNumbers = await getNumOfPages(page, storeObj.name, storeObj.selectors);

        if (pageNumbers !== null && pageNumbers > 1) {
            for (let i = 2; i <= pageNumbers; i++) {
                if (storeObj.name === "LojaVirus") {
                    await page.goto(`${url}?pagina=${i}`, { waitUntil: 'domcontentloaded' });
                } else {
                    await page.goto(`${url}search/page/${i}?q=${term.replace(/\s+/g, "+").toLowerCase()}`, { waitUntil: 'load' });
                    storeObj.name === "GDLP" ? await page.waitForTimeout(3000) : null;
                }
                const newLinks = await page.$$eval(storeObj.selectors.links, (containers) => {
                    return containers.map(container => container.querySelector("a").href);
                });
                links.push(...newLinks);
            }
        }

        if (links.length !== 0) {
            console.log(`Found ${links.length} links for ${term} on ${storeObj.name}`);
            return links;
        } else {
            console.error(`No links found for ${term} on ${storeObj.name}`);
        }
    } catch (error) {
        console.error("Error getting links:", error);
        console.error(error.stack);
        return [];
    }
}

async function processLink(page, link, storeObj) {
    try {
        await page.setUserAgent(randomUserAgent.getRandom());
        await interceptRequests(page);

        const srcLink = link;
        const store = storeObj.name;

        storeObj.name === "GDLP" ? await page.waitForTimeout(5000) : null;
        await Promise.all([
            page.goto(link, { waitUntil: storeObj.name === "GDLP" ? "load" : "domcontentloaded" }),
            page.waitForSelector(storeObj.selectors.sneakerName),
            page.waitForSelector(storeObj.selectors.productReference),
            page.waitForSelector(storeObj.selectors.img),
            page.waitForSelector(storeObj.selectors.price),
        ]);

        await scrollPage(page);
        storeObj.name === "GDLP" ? await page.waitForTimeout(3000) : null;
        const availableSizes = await getAvailableSizes(page, storeObj);
        const sneakerName = await getSneakerName(page, storeObj);
        const productReference = await getProductReference(page, storeObj);
        const img = await getImg(page, storeObj);
        const price = await getPrice(page, storeObj);
        const discountPrice = await getDiscountPrice(page, storeObj);

        const sneakerObj = {
            srcLink,
            productReference,
            store,
            img,
            sneakerName,
            currentPrice: price,
            discountPrice: discountPrice,
            priceHistory: [{ price, date: new Date() }],
            availableSizes,
        };

        const searchTerm = ((link.match(/\/([^\/]+)$/) || [])[1] || '').split('-').slice(0, 2).join(' ');
        if (
            sneakerName.toLowerCase().includes('tênis') ||
            sneakerName.toLowerCase().includes('tenis') ||
            sneakerName.toLowerCase().includes(searchTerm) &&
            (availableSizes !== null && availableSizes.length !== 0)
        ) {
            await updateOrCreateSneaker(sneakerObj);
            storeObj.name === "GDLP" ? await page.waitForTimeout(3000) : null;

        } else {
            console.log(`Not a sneaker or not available sizes: ${sneakerName} / ${availableSizes}`);
        }
    } catch (error) {
        console.error("Error processing link:", error);
        console.error(error.stack);
    }
}

async function getAvailableSizes(page, storeObj) {
    try {
        const availableSizes = await page.$$eval(storeObj.selectors.availableSizes, (els) => {
            return els
                .filter(el => !el.classList.contains('item_unavailable') && !el.classList.contains('disabled'))
                .map((el) => {
                    const sizeText = el.innerText.trim();
                    const numericSize = parseFloat(sizeText.replace(/\D/g, ''));
                    return !isNaN(numericSize) ? numericSize : null;
                })
                .filter((size) => size !== null);
        });

        return availableSizes;
    } catch (error) {
        console.error("Error getting available sizes:", error);
        console.error(error.stack);
        return [];
    }
}

async function getSneakerName(page, storeObj) {
    try {
        const sneakerName = await page.$eval(storeObj.selectors.sneakerName, (el) => el.innerText.trim());
        return sneakerName;
    } catch (error) {
        console.error("Error getting sneaker name:", error);
        console.error(error.stack);
    }
}

async function getProductReference(page, storeObj) {
    try {
        const productReference = storeObj.name.toLowerCase().includes("lojavirus")
            ? await page.$eval(storeObj.selectors.productReference, (el) => {
                const match = el.innerText.match(/\b([A-Za-z0-9-]+)\b$/);
                return match ? match[1] : el.innerText;
            })
            : await page.$eval(storeObj.selectors.productReference, (el) => el.innerText);
        return productReference;
    } catch (error) {
        console.error("Error getting product reference:", error);
        console.error(error.stack);
    }
}

async function getImg(page, storeObj) {
    try {
        const img = await page.$eval(storeObj.selectors.img, (el) => el.querySelector("img").src);
        return img;
    } catch (error) {
        console.error("Error getting img:", error);
        console.error(error.stack);
    }
}

async function getPrice(page, storeObj) {
    try {
        const price = await page.$eval(storeObj.selectors.price, (el) => {
            const sellPriceAttribute = el.getAttribute("data-sell-price");

            const priceText = el.innerText;
            const match = priceText.match(/R\$\s*([^\n]+)$/);
            if (match) {
                return match[1];
            }
            return strToDecimal(sellPriceAttribute);
        });
        return strToDecimal(price);
    } catch (error) {
        console.error("Error getting price:", error);
        console.error(error.stack);
    }
}

async function getDiscountPrice(page, storeObj) {
    try {
        const discountPrice = storeObj.name.toLowerCase().includes("cdr")
            ? await page.$eval("span.desconto-a-vista strong", (el) => {
                const priceText = el.innerText;
                const match = priceText.match(/R\$\s*([^\n]+)$/);
                if (match) {
                    return match[1];
                }
                return null;
            })
            : null;
        return discountPrice ? strToDecimal(discountPrice) : discountPrice;
    } catch (error) {
        console.error("Error getting discount price:", error);
        console.error(error.stack);
    }
}

module.exports = {
    getLinks,
    processLink,
};
