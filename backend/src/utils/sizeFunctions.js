async function getAvailableSizes(sizesObj) {
    const { page, storeObj } = sizesObj;

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
        return [];
    }
}

module.exports = {
    getAvailableSizes
}