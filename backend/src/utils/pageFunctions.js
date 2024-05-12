const { lastString } = require("./stringManipulation");

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function createSearchUrl(url, term) {
    if (url.includes("correderua")) {
        return [`${url}${term}`];
    }

    if (url.includes("gdlp")) {
        return [`${url}${term.replace(/\s+/g, "-").toLowerCase()}`];
    }

    if (url.includes("artwalk")) {
        return [`${url}${term}`];
    }

    if (url.includes("lojavirus")) {
        return [`${url}${term === "converse" ? 'converse-all-star' : term.replace(/\s+/g, "-").toLowerCase()}-tipo-tenis`];
    }

    if (url.includes("sunika")) {
        return [`${url}marcas/${term.replace(/\s+/g, "-").toLowerCase()}.partial`];
    }

    if (url.includes("maze")) {
        switch (term) {
            case "nike":
                return ['https://www.maze.com.br/product/getproductscategory/?path=%2Fcategoria%2Ftenis%2Fnike&viewList=g&pageSize=0&category=124682'];

            case "adidas":
                return ['https://www.maze.com.br/product/getproductscategory/?path=%2Fcategoria%2Ftenis%2Fadidas&viewList=g&pageSize=0&category=124985'];

            case "vans":
                return ['https://www.maze.com.br/product/getproductscategory/?path=%2Fcategoria%2Ftenis%2Fvans&viewList=g&pageSize=0&category=125036'];

            case "puma":
                return ['https://www.maze.com.br/product/getproductscategory/?path=%2Fcategoria%2Ftenis%2Fpuma&viewList=g&pageSize=0&category=124701'];

            case "converse":
                return ['https://www.maze.com.br/product/getproductscategory/?path=%2Fcategoria%2Ftenis%2Fconverse&viewList=g&pageSize=0&category=125146'];

            case "new balance":
                return ['https://www.maze.com.br/product/getproductscategory/?path=%2Fcategoria%2Ftenis%2Fnew-balance&viewList=g&pageSize=0&category=125147'];

            default:
                break;
        }
    }

    if (url.includes("ratusskateshop")) {
        if (term === "Dc" || term === "New Balance" || term === "Nike Sb") {
            return [`${url}tenis1/?mpage=10&Marca=${encodeURIComponent(term)}`, `${url}tenisquickstrike/?mpage=2&Marca=${encodeURIComponent(term)}`];
        }

        return [`${url}tenis1/?mpage=10&Marca=${encodeURIComponent(term)}`];
    }

    if (url.includes("wallsgeneralstore")) {
        if (term === "converse") {
            return [`${url}calcados/converse`]
        }
        return [`${url}loja/busca.php?palavra_busca=${term.replace(/\s+/g, "+").toLowerCase()}&variants%5B%5D=Categorias%7C%7CT%C3%AAnis`];
    }

    if (url.includes("ostore")) {
        return [`${url}sneakers/${encodeURIComponent(term).toLowerCase()}?O=OrderByReleaseDateDESC&PS=28`];
    }

    if (url.includes("sunsetskateshop")) {
        return [`${url}marca/calcados/${term.replace(/\s+/g, "-").toLowerCase()}`];
    }

    if (url.includes("netshoes")) {
        return [`${url}tenis/${term.replace(/\s+/g, "-").toLowerCase()}?tipo-de-produto=tenis&marca=${term.replace(/\s+/g, "-").toLowerCase()}`];
    }

    console.error("Invalid URL:", url);
    return url;
}

function getSearchTerms(searchTermObj) {
    const { url, searchFor } = searchTermObj;
    const searchTerms = [];
    try {
        for (const term of searchFor) {
            const searchUrl = createSearchUrl(url, term);
            searchTerms.push(...searchUrl);
        }
    } catch (error) {
        console.error("Error getting search terms:", error);
    }
    return searchTerms;
}

async function getNumOfPages(numOfPagesObj) {
    const { page, storeName, storeSelectors, url } = numOfPagesObj;
    try {
        await page.goto(url);
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

            case "Netshoes":
                const selectorsArray = storeSelectors.pagination.split(',');
                let totalNetshoes = null;
                for (const selector of selectorsArray) {
                    totalNetshoes = await page.evaluate((selector) => {
                        const element = document.querySelector(selector);
                        if (element) {
                            const textContent = element.textContent.trim();
                            const matchResult = textContent.match(/(?:de )?([\d.]+) (?:produtos|resultados)/i);
                            if (matchResult && matchResult.length > 1) {
                                const numericValue = matchResult[1].replace(/\./g, '');
                                return parseInt(numericValue);
                            }
                        }
                        return null;
                    }, selector);
                    if (totalNetshoes) break;
                }
                return totalNetshoes ? Math.ceil(totalNetshoes / 42) : null;

            case "Sunika":
                const totalSunika = await page.$eval(storeSelectors.pagination, (el) => el.innerText.trim());
                return totalSunika ? parseInt(lastString(totalSunika)) : null;

            case "Maze":
                const hasNextPage = await page.$(storeSelectors.pagination, { timeout: 1500 });
                if (hasNextPage) {
                    const totalMaze = await page.$eval(storeSelectors.pagination, (el) => {
                        const lastPage = el.getAttribute('data-last-page');
                        if (lastPage) {
                            return lastPage;
                        }
                        return null;
                    });
                    return totalMaze ? parseInt(totalMaze) : null;
                }
                return 1;

            case "Artwalk":
                const totalArtwalk = await page.$eval(storeSelectors.pagination, (el) => {
                    const products = el?.innerText.match(/\d+/g);
                    if (products) {
                        return parseInt(products[0]);
                    }
                    return null;
                })
                return totalArtwalk ? Math.ceil(totalArtwalk / 12) : null;

            default:
                return null;
        }
    } catch (error) {
        console.error("Error getting num of pages:", error);
        console.error(error.stack);
    }
}

async function getCurrentPage(currentPageObj) {
    const { url, storeName } = currentPageObj;
    try {
        switch (storeName) {
            case "CDR":
            case "Artwalk":
                const cdrMatch = url.match(/=(\d+)/);
                return cdrMatch ? parseInt(cdrMatch[1]) : 1;

            case "LojaVirus":
                const queryParams = new URLSearchParams(url);
                return parseInt(queryParams.get("pagina")) || 1;

            case "GDLP":
                const lastNumberMatch = url.match(/\/(\d+)(\/?)$/);
                const lastNumberString = lastNumberMatch ? lastNumberMatch[1] : null;
                return lastNumberString ? parseInt(lastNumberString) : 1;

            case "Ostore":
                const match = url.match(/#(\d+)/);
                return match ? parseInt(match[1]) : 1;

            case "Netshoes":
                const searchParams = new URLSearchParams(url);
                return parseInt(searchParams.get("page")) || 1;

            case "Sunika":
                const SunikaMatch = url.match(/=(\d+)/);
                return SunikaMatch ? parseInt(SunikaMatch[1]) : 1;

            case "Maze":
                const MazeMatch = url.match(/pageNumber=(\d+)/);
                return MazeMatch ? parseInt(MazeMatch[1]) : 1;

            default:
                return 1;
        }
    } catch (error) {
        console.error("Error getting current page:", error);
        throw error;
    }
}

async function scrollPage(scrollObj) {
    const { page, storeObj } = scrollObj;
    try {
        let previousLinks = await page.$$eval(storeObj.selectors.links, (containers) => {
            return containers
                .filter(container => !container.querySelector('.products__item-sold-off'))
                .map(container => container.querySelector("a")?.href);
        });

        while (true) {
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });

            await page.waitForTimeout(1500);

            const currentLinks = await page.$$eval(storeObj.selectors.links, (containers) => {
                return containers
                    .filter(container => !container.querySelector('.products__item-sold-off'))
                    .map(container => container.querySelector("a")?.href);
            });

            if (arraysEqual(previousLinks, currentLinks)) {
                break;
            } else {
                previousLinks = currentLinks;
            }
        }

        return previousLinks;
    } catch (error) {
        console.error("Error scrolling page:", error);
    }
}

module.exports = {
    getSearchTerms,
    getNumOfPages,
    getCurrentPage,
    scrollPage
}