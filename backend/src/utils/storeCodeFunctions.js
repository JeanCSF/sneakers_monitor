async function getCodeFromStore(codeFromStoreObj) {
    const { page, url, storeObj } = codeFromStoreObj;
    const slugName = url.split("/").pop();

    try {
        if (storeObj.name === "SunsetSkateshop") {
            const axios = require('axios');

            const storeData = {
                "_id": "57a1e6130607512a23cdf437",
                "store": "SUNSET SKATESHOP",
                "cnpj": "10604561000153"
            };

            const headers = {
                'X-Store-Data': JSON.stringify(storeData),
                'Content-Type': 'application/json'
            };

            const response = await axios.get(`https://api.sunsetskateshop.com.br:8443/public/products/getProduct/${slugName}`, { headers });
            const responseData = response.data.data;

            return responseData._cod;
        }

        if (storeObj.name === "Sunika") {
            const productSku = await page.$eval(storeObj.selectors.productReference, (el) => {
                const match = el.innerText.match(/"sku": "\s*([^"]*)"/i);
                return match ? match[1].trim() : el.innerText;
            })

            return productSku.trim();
        }

        if (storeObj.name === "RatusSkateshop") {
            const productSku = await page.$eval(storeObj.selectors.storeSku, (el) => {
                const match = el.innerText.match(/"sku": "\s*([^"]*)"/i);
                return match ? match[1].trim() : el.innerText;
            })

            return productSku.trim();
        }

        if (storeObj.name === "WallsGeneralStore") {
            const productSku = await page.$eval(storeObj.selectors.productReference, el => el?.innerText.toUpperCase().trim());
            return productSku;
        }

        if (storeObj.name === "Ostore" || storeObj.name === "Maze") {
            const productSku = await page.$eval(storeObj.selectors.storeSku, el => el?.innerText.toUpperCase().trim());
            return productSku;
        }

        if (storeObj.name === "CDR") {
            const productSku = await page.$eval(storeObj.selectors.storeSku, (el) => {
                const productId = el?.getAttribute("data-produto-id");
                return productId;
            });
            return productSku;
        }

        if (storeObj.name === "Netshoes") {
            const productSku = await page.$eval(storeObj.selectors.productReference, (el) => {
                const reference = el.getAttribute("data-code");
                return reference;
            });
            return productSku.toUpperCase();
        }

    } catch (error) {
        console.error("Error getting code from store:", error);
        return null;
    }
}

module.exports = {
    getCodeFromStore
}