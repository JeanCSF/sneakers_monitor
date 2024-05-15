const { Decimal128 } = require("mongodb");

function parseDecimal(str) {
    const cleanedStr = str.replace(/[^0-9.,]/g, '');
    const dotDecimalStr = cleanedStr.replace(/\./g, '').replace(',', '.');
    return new Decimal128(dotDecimalStr);
}

async function getPrice(priceObj) {
    const { page, storeObj } = priceObj;

    try {
        const price = await page.$eval(storeObj.selectors.price, (el, storeObj) => {

            if (storeObj.name === "WallsGeneralStore") { return el.innerText.trim(); }
            const removeDelTag = (element) => {
                const delElement = element.querySelector('del');
                if (delElement) {
                    delElement.remove();
                }
            };

            removeDelTag(el);

            const priceText = el.innerText.trim();
            const match = priceText.match(/R\$\s*([\d.,]+)/);
            const sellPriceAttribute = el.getAttribute('data-sell-price');

            if (match) {
                return match[1];
            } else {
                return storeObj.name === "CDR" && sellPriceAttribute.replace('.', ',');
            }
        }, storeObj);

        return parseDecimal(price);

    } catch (error) {
        console.error("Error getting price:", error);
    }
}

async function getDiscountPrice(discountPriceObj) {
    const { page, storeObj } = discountPriceObj;

    try {
        if (storeObj.name.toLowerCase().includes("cdr")) {
            const discountPrice = await page.$eval(storeObj.selectors.discountPrice, (el) => {
                const priceText = el.innerText;
                const match = priceText.match(/R\$\s*([^\n]+)$/);
                if (match) {
                    return match[1];
                }
                return null;
            })
            return discountPrice ? parseDecimal(discountPrice) : discountPrice;
        }

        if (storeObj.name.toLowerCase().includes("netshoes")) {
            const discountPrice = await page.$eval(storeObj.selectors.discountPrice, (el) => {
                const priceText = el.innerText;
                const match = priceText.match(/R\$\s*([\d.,]+)/);
                if (match) {
                    return match[1];
                }
                return null;
            })
            return discountPrice ? parseDecimal(discountPrice) : discountPrice;
        }

        return null;
    } catch (error) {
        console.error("Error getting discount price:", error);
    }
}

module.exports = {
    getPrice,
    getDiscountPrice
}