const { lastString, last2Strings } = require('./stringManipulation');

async function getProductReference(referenceObj) {
    const { page, storeObj, sneakerTitle, brands } = referenceObj;

    try {
        if (
            storeObj.name === "CDR" ||
            storeObj.name === "WallsGeneralStore" ||
            storeObj.name === "GDLP"
        ) {
            const productReference = await page.$eval(storeObj.selectors.productReference, (el) => el?.innerText.toUpperCase().trim());
            return productReference;
        }

        if (storeObj.name === "Artwalk") {
            const productReference = await page.$eval(storeObj.selectors.productReference, (el) => el?.innerText.toUpperCase().trim());
            if (brands.map(brand => brand).includes("ADIDAS")) {
                return productReference.match(/^[^-]*/)[0];

            }

            if (brands.map(brand => brand).includes("NEW BALANCE")) {
                return productReference.replace(/-(\d+)$/, '').replace(/-/g, '');

            }

            return productReference;
        }

        if (storeObj.name === "SunsetSkateshop") {
            let sneakerName = sneakerTitle;
            for (let i = 0; i < brands.length; i++) {
                if (brands[i] === "NEW BALANCE" || brands[i] === "ADIDAS") {
                    return lastString(sneakerName).toUpperCase();
                }

                if (brands[i] === "NIKE SB" || brands[i] === "NIKE") {
                    const match = sneakerName.match(/\b([A-Z0-9]+-[0-9]+)\b$/i);
                    if (match) {
                        return match[1].trim();
                    }
                    return sneakerName.split(" ").slice(-2).join(" ").toUpperCase();
                }

                if (brands[i] === "TESLA") {
                    return last2Strings(sneakerName).toUpperCase();
                }

                if (brands[i] === "VANS" || brands[i] === "THE NORTH FACE") {
                    const productReference = await page.$eval(storeObj.selectors.productReference, (el) => {
                        const elements = el.querySelectorAll('p');
                        return elements[elements.length - 1].innerText.trim();
                    });

                    if (productReference) {
                        const match = productReference.match(/REF:\s*(.*)/i);
                        return match ? match[1].trim() : "";
                    }
                    return "";
                }

                if (brands[i] === "OUS") {
                    const haveRef = await page.$('.product__description.ng-scope > h1 > span', { timeout: 1500 });
                    if (haveRef) {
                        const productReference = await page.$eval('.product__description.ng-scope > h1 > span', (el) => el.innerText.trim());
                        return lastString(productReference).toUpperCase();
                    }
                }
                return "";
            }
        }

        if (storeObj.name === "RatusSkateshop") {
            const productReference = await page.$eval(storeObj.selectors.productReference, el => el?.innerText.toUpperCase());

            for (let i = 0; i < brands.length; i++) {
                if (brands[i] === "DC") {
                    const regex = /\b(?:[A-Z]{2,}\d{6,}[\w.-]*|DC\d{3}[A-Z]?[.-][A-Z]{3}|[A-Z]{4}\d{6,}-\w{2,})\b/g;
                    const match = productReference.match(regex);
                    if (match) {
                        return match[0];
                    }

                    return "";
                }

                if (brands[i] === "NEW BALANCE") {
                    const regex = /\b[A-Z]{2}\d{3}[A-Z]{3}\b/g;
                    const match = productReference.match(regex);
                    if (match) {
                        return match[0];
                    }

                    return "";
                }

                if (brands[i] === "NIKE" || brands[i] === "NIKE SB") {
                    const regex = /\b([A-Z0-9]+-[0-9]+)\b/g;
                    const match = productReference.match(regex);
                    if (match) {
                        return match[0]
                            .replace(/\s*/g, '');
                    }

                    return "";
                }

                if (brands[i] === "OUS") {
                    const regex = /\b\d{6}[-_.]?\d{1,5}\b/g;
                    const match = productReference.match(regex) || productReference.match(/REF\.:\s*(.*)/i) || productReference.match(/REFERÊNCIA:\s*(.*)/i);
                    if (match) {
                        return match[0]
                            .replace("REF.:", '')
                            .replace("REFERÊNCIA:", '')
                            .trim();
                    }

                    return "";
                }

                if (brands[i] === "TESLA" || brands[i] === "VANS" || brands[i] === "CONVERSE" || brands[i] === "CARIUMA") {

                    const match = productReference.match(/REFERÊNCIA:\s*(.*)/i) ||
                        productReference.match(/REF:\s*(.*)/i) ||
                        productReference.match(/REF\.:\s*(.*)/i) ||
                        productReference.match(/MODELO:\s*(.*)/i) ||
                        productReference.match(/CÓDIGO:\s*(.*)/i) ||
                        productReference.match(/CÓD\.:\s*(.*)/i) ||
                        productReference.match(/CÓDIGO DO FABRICANTE\s*(.*)/i) ||
                        productReference.match(/STYLE:\s*(.*)/i);

                    if (match) {
                        return match[0]
                            .replace("REFERÊNCIA:", '')
                            .replace("REF.:", '')
                            .replace("REF:", '')
                            .replace("MODELO:", '')
                            .replace("CÓDIGO:", '')
                            .replace("CÓD.:", '')
                            .replace("CÓDIGO DO FABRICANTE", '')
                            .replace("STYLE:", '')
                            .replace(/\s*/g, '')
                            .trim();
                    }

                    return "";
                }

            }
        }

        if (storeObj.name === "Sunika") {
            const productReference = await page.$eval(storeObj.selectors.productReference, (el) => {
                const match = el.innerText.match(/"mpn": "\s*([^"]*)"/i);
                return match ? match[1].trim() : el.innerText;
            })

            return productReference
                .replace('"', '')
                .trim()
                .toUpperCase();
        }

        if (storeObj.name === "Maze") {
            const productReference = await page.$eval(storeObj.selectors.productReference, (el) => {
                const match = el.innerText.match(/:(.*?)\s*$/);
                return match ? match[1].trim() : el.innerText.trim();
            });

            if (brands[0].includes("NIKE") || brands[0].includes("NIKE SB")) {
                const match = productReference.match(/\b([A-Z0-9]+-[0-9]+)\b/g);
                if (match) {
                    return match[0].trim();
                }
                return "";
            } else {
                return productReference.toUpperCase();
            }
        }

        if (storeObj.name === "Netshoes") {
            const productReference = await page.$eval(storeObj.selectors.productReference, (el) => {
                const reference = el.getAttribute("data-code");
                return reference;
            });
            return productReference.toUpperCase();
        }

        if (storeObj.name === "Ostore") {
            const productReference = await page.$eval(storeObj.selectors.productReference, (el) => el.innerText.toUpperCase());
            const match = productReference.match(/REF\.:\s*(.*)/i);
            return match ? match[1].trim() : "";
        }

        if (storeObj.name === "LojaVirus") {
            const productReference = await page.$eval(storeObj.selectors.sneakerName, (el) => el?.innerText.split(" "));
            return productReference[productReference.length - 1].toUpperCase().trim();
        }

    } catch (error) {
        console.error("Error getting product reference:", error);
    }
}

module.exports = {
    getProductReference
}