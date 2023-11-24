const pup = require("puppeteer");

const url = "https://droper.app/buscar";
const searchFor = 'air force';

(async () => {
    const browser = await pup.launch({ headless: true });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    console.log('init ok!');
    page.on('request', request => {
        if (request.resourceType() === 'image') {
            request.abort();
        } else {
            request.continue();
        }
    });

    const products = [];

    let currentPage = 0;
    let hasMoreResults = true;

    while (hasMoreResults) {
        const { produtos } = await page.evaluate(async (currentPage) => {
            const requestData = {
                marcas: [],
                termo: "air force",
                tamanhos: [],
                cores: [],
                page: currentPage,
                amount: 40
            };
            const response = await fetch('https://service.cataloko.com/api/search/v4', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();
    
            return result;
        }, currentPage);

        if (produtos && produtos.length > 0) {
            products.push(...produtos);

            currentPage++;
            console.log(currentPage);
        } else {

            hasMoreResults = false;
        }
    }
    
    console.log(products);
    await page.waitForTimeout(3000);
    await browser.close();
})();
