async function getImg(imgObj) {
    const { page, storeObj, productReference, sneakerLink } = imgObj;

    try {
        if (storeObj.name === "Netshoes") {
            const urlInfo = sneakerLink.match(/[^\/]*$/)[0].replace(productReference, '').replace(/.$/, '');
            const digit = productReference.match(/\d{2}(?=\D*$)/)[0];

            return `https://static.netshoes.com.br/produtos/${urlInfo}/${digit}/${productReference}/${productReference}_zoom1.jpg`;
        }

        if (storeObj.name === "Sunika") {
            const productReference = await page.$eval(storeObj.selectors.productReference, (el) => {
                const match = el.innerText.match(/"image": \[\s*"([^"]*)"/i);
                return match ? match[1].trim() : el.innerText;
            })

            return productReference.trim();
        }

        if (storeObj.name === "WallsGeneralStore" || storeObj.name === "Artwalk") {
            const img = await page.$eval(storeObj.selectors.img, (el) => el?.src);
            return img;
        }

        const img = await page.$eval(storeObj.selectors.img, (el, storeObj) => {
            const imgElement = el.querySelector("img");

            if (storeObj.name === "Maze" || storeObj.name === "WallsGeneralStore" || storeObj.name === "GDLP") {
                const aElement = el.querySelector("a")?.href;
                return aElement;
            }

            return imgElement?.src;
        }, storeObj);

        return img;
    } catch (error) {
        console.error("Error getting img:", error);
    }
}

module.exports = {
    getImg
}