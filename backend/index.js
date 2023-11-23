const pup = require("puppeteer");

const url = "https://droper.app/buscar";
const searchFor = 'air force';

(async () => {
    const browser = await pup.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    console.log('init ok!');

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    console.log('url access');

    await page.waitForSelector('.buscarv4-input');

    await page.type('.buscarv4-input', searchFor);
    await page.keyboard.press('Enter')
    await page.waitForSelector('button.buscarv4-btn-filtrar');
    await page.click('button.buscarv4-btn-filtrar');

    await page.waitForSelector('button.md-icon-button.md-button.md-autofocus.md-ink-ripple');
    await page.waitForTimeout(1000);
    await page.click('button.md-icon-button.md-button.md-autofocus.md-ink-ripple');
    await page.click('#radio-menorprecoordenacao');
    await page.click('.buscarv4-input');


    await Promise.all([
        page.waitForNavigation(),
    ]);

    const links = await page.$$eval('div[ng-click^="$root.irPara"] > a', anchors => {
        return anchors.map(anchor => anchor.href);
    });
    
    console.log(links);
    console.log(links.length);
    for (const link of links) {
        await page.goto(link);
        await page.waitForSelector('.segura-nome');
        await page.waitForTimeout(1000);

        const srcLink = link;
        const img = await page.$eval('.slick-slide', el => el.querySelector('a').href);
        const productReference = await page.$eval('.segura-nome', el => el.querySelector('h1').innerText.match(/\b[A-Z]+\d+-\d+\b/).toString());
        const sneakerName = await page.$eval('.segura-nome', el => el.querySelector('h1').innerText);

        const price = await page.$eval('.precoPor', el => {
            const priceText = el.innerText;
            const match = priceText.match(/R\$\s*([^\n]+)$/);
            if (match) {
                return match[1];
            }
            return null;
        });

        const availableSizes = await page.$$eval('.valorAtributo:not(.disabled)', els => {
            return els
                .map(el => el.innerText.trim())
                .filter(text => /\d+/.test(text));
        });

        const sneakerObj = { srcLink, img, productReference, sneakerName, price, availableSizes };
        console.log(sneakerObj);
    }
    await page.waitForTimeout(5000);
    await browser.close();
})();
