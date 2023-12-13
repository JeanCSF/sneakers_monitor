const { Cluster } = require('puppeteer-cluster');
const { arraysEqual, updateOrCreateSneaker, createSearchUrl } = require('./src/utils/utils');
const urls = [
    'https://www.correderua.com.br/',
    'https://www.artwalk.com.br/',
    'https://gdlp.com.br/',
    'https://www.lojavirus.com.br/',
    // 'https://youridstore.com.br/',
];

const searchFor = [
    'air force',
    'air max',
    'air jordan 1 high',
    'air jordan 1 mid',
    'air jordan 1 low',
    'air jordan 2',
    'air jordan 3',
    'air jordan 4',
    'air jordan 5',
    'air max 95',
    'air max 97',
    'air max tn',
    'air max 90',
    'adidas forum'
];
(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 5,
        monitor: true,
        puppeteerOptions: {
            headless: false,
        }
    });

    await cluster.task(async ({ page, data: { url } }) => {
        for (const term of searchFor) {
            try {
                await page.goto(createSearchUrl(url, term), { waitUntil: 'domcontentloaded' });
                console.log("fim")
                // await updateOrCreateSneaker(sneakerObj, term);
            } catch (error) {
                console.error(`Erro ao processar ${url} com o termo ${term}:`, error);
            }
        }
    });

    for (const url of urls) {
        cluster.queue({ url });
    }
    await cluster.idle();
    await cluster.close();

})();