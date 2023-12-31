const onTest = true;

const proxyList = [
    '170.254.99.210:8080',
    '187.85.82.222:55676',
    '189.85.82.38:3128',
    '177.190.189.16:44443',
    '177.137.227.246:128',
    '201.91.82.155:3128',
    '200.53.19.6:3128',
    '138.122.82.145:8080',
    '177.37.100.253:31288',
    '200.7.118.68:666',
    '45.232.79.0:9292',
    '177.53.214.27:999',
    '143.208.152.61:3180',
    '191.179.216.84:8080',
    '177.99.203.179:8080',
    '186.250.25.230:55443',
    '45.7.64.49:999',
    '45.71.169.145:80',
    '138.59.20.42:9999',
    '177.93.45.154:999',
    '177.38.10.15:8080',
    '179.107.54.27:5566',
    '192.141.196.129:8080',
    '177.53.214.208:999',
    '200.7.10.158:8080',
    '187.1.57.206:20183',
    '170.245.132.86:999',
    '177.66.101.223:8024',
    '177.93.45.156:999',
    '45.235.46.94:8080',
    '177.25.40.146:4343',
];

const { Sneaker: SneakerModel } = require("../../models/Sneaker");
const { Decimal128 } = require("mongodb");

const randomUserAgent = require('random-useragent');
let randUserAgent;
import('rand-user-agent').then(randUserAgentModule => {
    randUserAgent = randUserAgentModule.default || randUserAgentModule.getRandom;
});
async function generateRandomUserAgent() {
    const useRandomUserAgentLib = Math.random() < 2;
    if (useRandomUserAgentLib) {
        return randomUserAgent.getRandom((ua) => {
            return ua.osName === "macOS" ||
                ua.osName === "Windows" && ua.deviceType === "desktop" &&
                ua.browserName === "Chrome" ||
                ua.browserName === "Firefox" ||
                ua.browserName === "Safari" ||
                ua.browserName === "Edge";
        });
    } else {
        return randUserAgent("desktop", "chrome", "windows", "macOS");
    }
}

const ExcelJS = require("exceljs");
const path = require("path");
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("Test Data");
worksheet.addRow(["Store", "Product Reference", "Sneaker Name", "Current Price", "Discount Price", "Available Sizes", "Date", "Link", "Image"]);

async function scrollPage(page) {
    async function scrollToEnd(page) {
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
    };

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

function parseDecimal(str) {
    const cleanedStr = str.replace(/[^0-9.,]/g, '');
    const dotDecimalStr = cleanedStr.replace(/\./g, '').replace(',', '.');
    return new Decimal128(dotDecimalStr);
}

async function updateOrCreateSneaker(sneakerObj) {
    const { productReference, store } = sneakerObj;
    try {
        if (onTest) {
            if (sneakerObj.availableSizes.length >= 1) {
                worksheet.addRow([sneakerObj.store, sneakerObj.productReference, sneakerObj.sneakerName, sneakerObj.currentPrice, sneakerObj.discountPrice, sneakerObj.availableSizes.join(', '), new Date().toLocaleString(), sneakerObj.srcLink, sneakerObj.img]);
                const filePath = path.join(__dirname, "test_data.xlsx");
                await workbook.xlsx.writeFile(filePath);
                console.log(`Sneaker ${sneakerObj.sneakerName} added to test data: ${filePath}`);
            } else {
                console.log(`Sneaker ${sneakerObj.sneakerName} has no available sizes.`);
            }
        } else {
            const existingSneaker = await SneakerModel.findOne({ store, productReference });
            if (existingSneaker) {
                if (!arraysEqual(existingSneaker.availableSizes, sneakerObj.availableSizes)) {
                    existingSneaker.availableSizes = sneakerObj.availableSizes;
                    await existingSneaker.save();
                    console.log("Available sizes changed.");
                }

                if (Number(existingSneaker.currentPrice) !== Number(sneakerObj.currentPrice)) {
                    existingSneaker.currentPrice = sneakerObj.currentPrice;
                    existingSneaker.priceHistory.push({ price: sneakerObj.currentPrice, date: new Date(), });
                    await existingSneaker.save();
                    console.log("Sneaker price changed.");
                }
            } else {
                if (sneakerObj.availableSizes.length >= 1) {
                    await SneakerModel.create(sneakerObj);
                    console.log("Sneaker successfully added to database.");
                }
            }
        }
    } catch (error) {
        console.error("Unexpected error:", error);
    }
}

function createSearchUrl(url, term) {
    if (url.includes("correderua")) {
        return `${url}buscar?q=${term.replace(/\s+/g, "+").toLowerCase()}`;
    }

    if (url.includes("gdlp")) {
        return `${url}catalogsearch/result/?q=${term.replace(/\s+/g, "+").toLowerCase()}`;
    }

    if (url.includes("artwalk")) {
        return `${url}${encodeURIComponent(term).toLowerCase()}?O=OrderByPriceASC&PS=24`;
    }

    if (url.includes("lojavirus")) {
        return `${url}busca?busca=${term.replace(/\s+/g, "-").toLowerCase()}`;
    }

    if (url.includes("sunika")) {
        return `${url}pesquisa?t=${term.replace(/\s+/g, "+").toLowerCase()}`;
    }

    if (url.includes("maze")) {
        return `${url}busca?n=${encodeURIComponent(term).toLowerCase()}`;
    }

    if (url.includes("ratusskateshop")) {
        return `${url}search/?q=${encodeURIComponent(term).toLowerCase()}`;
    }

    if (url.includes("wallsgeneralstore")) {
        return `${url}loja/busca.php?loja=690339&palavra_busca=${term.replace(/\s+/g, "+").toLowerCase()}`;
    }

    if (url.includes("ostore")) {
        return `${url}${encodeURIComponent(term).toLowerCase()}?O=OrderByReleaseDateDESC&PS=28`;
    }

    if (url.includes("sunsetskateshop")) {
        return `${url}busca/${term.replace(/\s+/g, "-").toLowerCase()}`
    }

    console.error("Invalid URL:", url);
    return url;
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
        if (dialog) {
            try {
                await dialog.accept();
            } catch (error) {
                console.error('Erro ao aceitar o diálogo:', error.message);
            }
        }
    });
}

async function getNumOfPages(page, storeName, storeSelectors) {
    try {
        switch (storeName) {
            case "CDR":
            case "LojaVirus":
                return await page.evaluate((selectors) => {
                    const links = document.querySelectorAll(selectors.pagination);
                    if (links.length >= 2) {
                        return parseInt(links[links.length - 2].innerText);
                    }
                    return null;
                }, storeSelectors);

            case "GDLP":
                const totalGdlp = await page.evaluate((selectors) => {
                    const element = document.querySelector(selectors.pagination);
                    return element ? element.textContent.trim().split(' ')[2] : null;
                }, storeSelectors);
                return totalGdlp ? Math.ceil(totalGdlp / 40) : null;

            case "Ostore":
                const totalOstore = await page.$eval(storeSelectors.pagination, (totalElement) => {
                    return totalElement ? parseInt(totalElement.textContent.trim()) : null;
                });
                return totalOstore ? Math.ceil(totalOstore / 28) : null;

            default:
                return null;
        }
    } catch (error) {
        console.error("Error getting num of pages:", error);
        console.error(error.stack);
    }
}

async function iteratePaginationLinks(page, pageNumbers, newUrl, storeObj, term) {
    try {
        const newLinks = [];
        for (let i = 2; i <= pageNumbers; i++) {
            switch (storeObj.name) {
                case "CDR":
                case "LojaVirus":
                    await page.setUserAgent(await generateRandomUserAgent());
                    await page.goto(`${newUrl}?pagina=${i}`, { waitUntil: 'domcontentloaded' });
                    break;

                case "GDLP":
                    await page.setUserAgent(await generateRandomUserAgent());
                    await page.goto(`${storeObj.baseUrl}search/page/${i}?q=${term.replace(/\s+/g, "+").toLowerCase()}`, { waitUntil: 'load' });
                    break;

                case "Ostore":
                    await page.setUserAgent(await generateRandomUserAgent());
                    await page.goto(`${newUrl}#${i}`, { waitUntil: 'networkidle2' });
                    await page.reload();
                    await page.waitForSelector('.pace-done');
                    break;

                default:
                    break;
            }

            const links = await page.$$eval(storeObj.selectors.links, (containers) => {
                return containers.map(container => container.querySelector("a").href);
            });

            newLinks.push(...links);
        }
        return newLinks;
    } catch (error) {
        console.error("Error iterating links from pagination:", error);
        console.error(error.stack);
    }
}

async function getLinks(page, url, storeObj, term) {
    try {
        await page.setUserAgent(await generateRandomUserAgent());
        await interceptRequests(page);
        await page.goto(createSearchUrl(url, term), { waitUntil: 'domcontentloaded' });
        const newUrl = await page.url();
        await scrollPage(page);

        const links = await page.$$eval(storeObj.selectors.links, (containers, storeObj) => {
            if (storeObj.name === "RatusSkateshop") {
                return containers
                    .filter(container => container.querySelector('.item-actions.m-top-half'))
                    .map(container => container.querySelector("a").href);
            }
            return containers.map(container => container.querySelector("a").href);
        }, storeObj);

        const pageNumbers = await getNumOfPages(page, storeObj.name, storeObj.selectors);
        if (pageNumbers !== null && pageNumbers > 1) {
            const newLinks = await iteratePaginationLinks(page, pageNumbers, newUrl, storeObj, term);
            links.push(...newLinks);
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
        await page.setUserAgent(await generateRandomUserAgent());
        await interceptRequests(page);

        const srcLink = link;
        const store = storeObj.name;
        await Promise.all([
            page.goto(link, { waitUntil: storeObj.name === "GDLP" ? "load" : "domcontentloaded" }),
            page.waitForSelector(storeObj.selectors.sneakerName),
            page.waitForSelector(storeObj.selectors.img),
            page.waitForSelector(storeObj.selectors.price),
        ]);
        await scrollPage(page);
        storeObj.name === "RatusSkateshop" ? await page.waitForTimeout(3000) : null;
        const sneakerName = await getSneakerName(page, storeObj);
        const productReference = await getProductReference(page, storeObj, link);
        const img = await getImg(page, storeObj);
        const price = await getPrice(page, storeObj);
        const discountPrice = await getDiscountPrice(page, storeObj);
        const availableSizes = await getAvailableSizes(page, storeObj);

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
        if ((availableSizes !== null && availableSizes.length !== 0) &&
            !sneakerName.toLowerCase().includes('calça') ||
            !sneakerName.toLowerCase().includes('camisa') ||
            !sneakerName.toLowerCase().includes('camiseta') ||
            !sneakerName.toLowerCase().includes('bolsa') ||
            sneakerName.toLowerCase().includes(searchTerm)
        ) {
            await updateOrCreateSneaker(sneakerObj);
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
        const availableSizesSet = new Set();
        const availableSizes = await page.$$eval(storeObj.selectors.availableSizes, (els) => {
            return els
                .filter(el => !el.classList.contains('item_unavailable') && !el.classList.contains('disabled'))
                .map((el) => {
                    const sizeText = el.innerText.trim();
                    const numericSize = parseFloat(sizeText.replace(',', '.'));
                    return !isNaN(numericSize) ? numericSize : null;
                })
                .filter((size) => size !== null);
        });
        availableSizes.forEach(size => availableSizesSet.add(size));

        return [...availableSizesSet];

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

async function getProductReference(page, storeObj, link) {
    try {
        if (storeObj.name.toLowerCase().includes("sunsetskateshop")) {
            const productReference = await page.$eval(storeObj.selectors.productReference, (productDescription) => {
                if (productDescription) {
                    const text = productDescription.textContent;
                    const match = text.includes('Modelo:') ? text.match(/Modelo:\s+(\S+)/) : text.match(/REF:\s*(\S+)/);
                    return match ? match[1].toUpperCase() : null;
                }
                return null;
            });

            return productReference;
        }

        if (storeObj.name.toLowerCase().includes("wallsgeneralstore")) {
            const match = link.match(/\/([^\/]+)\/?$/);
            if (match) {
                return `${storeObj.name}: ${match[1].toUpperCase()}`;
            }
        }

        if (storeObj.name.toLowerCase().includes("ratusskateshop")) {
            const match = link.match(/\/([^\/]+)\/?$/);
            if (match) {
                return `${storeObj.name}: ${match[1].toUpperCase()}`;
            }
        }

        if (storeObj.name.toLowerCase().includes("sunika")) {
            const match = link.match(/\/[^/]+-([^/]+)$/);
            if (match) {
                return match[1].toUpperCase();
            }
        }

        if (storeObj.name.toLowerCase().includes("lojavirus")) {
            const productReference = await page.$eval(storeObj.selectors.productReference, (el) => {
                const match = el.innerText.match(/\b([A-Za-z0-9-]+)\b$/);
                return match ? match[1] : el.innerText;
            })
            return productReference.toUpperCase();
        }

        if (storeObj.name.toLowerCase().includes("maze")) {
            const productReference = await page.$eval(storeObj.selectors.productReference, (el) => {
                const match = el.innerText.match(/:(.*?)\s*$/);
                return match ? match[1].trim() : el.innerText;
            });
            return productReference.toUpperCase();
        }

        const productReference = await page.$eval(storeObj.selectors.productReference, (el) => el.innerText);
        return productReference.toUpperCase();
    } catch (error) {
        console.error("Error getting product reference:", error);
        console.error(error.stack);
    }
}

async function getImg(page, storeObj) {
    try {
        const img = await page.$eval(storeObj.selectors.img, (el, storeObj) => {
            if (storeObj.name === "Maze") {
                const aElement = el.querySelector("a").href;
                return aElement;
            }
            const imgElement = el.querySelector("img");
            const srcset = imgElement.getAttribute("srcset");

            if (srcset) {
                const srcsetItemArray = srcset.split(',').map(item => item.trim());
                const lastSrcsetItem = srcsetItemArray[srcsetItemArray.length - 1];

                const lastSrcsetUrl = lastSrcsetItem.split(' ')[0];

                return `https:${lastSrcsetUrl}`;
            } else {
                return imgElement.src;
            }
        }, storeObj);
        return img;
    } catch (error) {
        console.error("Error getting img:", error);
        console.error(error.stack);
    }
}

async function getPrice(page, storeObj) {
    try {
        const price = await page.$eval(storeObj.selectors.price, (el, storeObj) => {
            const sellPriceAttribute = el.getAttribute("data-sell-price");

            const priceText = el.children.length > 0 ? el.children[0].innerText.trim() : el.innerText.trim();
            const match = priceText.match(/R\$\s*([^\n]+)$/);
            if (match) {
                return match[1];
            } else {
                return storeObj.name === "CDR" ? sellPriceAttribute.replace('.', ',') : priceText;
            }
        }, storeObj);
        return parseDecimal(price);
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
        return discountPrice ? parseDecimal(discountPrice) : discountPrice;
    } catch (error) {
        console.error("Error getting discount price:", error);
        console.error(error.stack);
    }
}

module.exports = {
    getLinks,
    processLink,
};
