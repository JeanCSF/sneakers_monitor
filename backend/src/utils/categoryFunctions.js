const categoryRegex = /(dunk|one star|all star|blazer|zoom|chinelo|adilette|slide|papete|sandália|mule|chuteira|tênis|ténis|tenis|plexus|slip on|slip-on|bota|boot|sst|feminino|masculino|infantil|unissex|gore-tex|gtx|waterproof|cordura|bola|sean wotherspoon|sean wotherpoon|ronnie fieg|salehe bembury|salehe-bembury|bob esponja|moca|moma|pharrell williams)/ig;
const badCategories = [
    '10%',
    '20',
    '20%',
    '25%',
    '30',
    '30%',
    '35%',
    '40',
    '40%',
    'ADIDAS',
    'ADIDAS X CIRCOLOCO',
    'ADIDAS X DISNEY',
    'ADIDAS X HUMAN MADE ADIMATIC HM',
    'ADIDAS X M&MS',
    'ADIDAS X RICH MNISI',
    'ADIDAS X SEAN WOTHERPOON',
    'ADIDAS X SEAN WOTHERSPOON X HOT WHEELS',
    'ORKETRO  X SEAN WOTHERSPOON',
    'ADIDAS X XLARGE',
    'ASICS',
    'BALLAHOLIC X ASICS GEL-LYTE III OG',
    'CARIUMA',
    'CLARKS ORIGINALS',
    'CLARKS ORIGINALS X RONNIE FIEG 8TH STREET LOCKHILL',
    'CLARKS ORIGINALS X RONNIE FIEG 8TH STREET MAYCLIFF',
    'CLARKS ORIGINALS X RONNIE FIEG 8TH STREET ROSSENDA',
    'CONVERSE',
    'CROCS',
    'CROCS X WU-TANG',
    'FILA',
    'GOLDEN GOOSE',
    'HIGHSNOBIETY X MIZUNO WAVE RIDER',
    'HOKA',
    'MIZUNO',
    'RANDOMEVENT X MIZUNO WAVE PROPHECY LS',
    'NEW BALANCE',
    'ON RUNNING',
    'ORKETRO X SEAN WOTHERSPOON',
    'PLEASURES X REEBOK CLASSIC LEATHER TRAIL',
    'REEBOK',
    'SALEHE BEMBURY X CROCS THE POLLEX CLOGV',
    'SALEHE-BEMBURY',
    'SUPERGA',
    'UNDER ARMOUR',
    'VANS',
    'VANS PRIDE',
    'VANS X BOB ESPONJA',
    'VANS X DENIM WOVEN',
    'VANS X MOCA',
    'VANS X MOMA',
    'VERT',
    'VERT X SEA-SHEPERD',
    'VERT  X SEA-SHEPERD',
    'VERT X MANSUR GAVRIEL',
    'VESTUÁRIO',
    'PRINCIPAL',
    'SALE',
    'OUTROS CALÇADOS',
    'BLACK FRIDAY',
    'CHINELOS',
    'BOTAS',
    'DESTAQUES',
    'LANÇAMENTOS',
    'MARCA',
    'COLLAB',
]

async function getCategories(categoriesObj) {
    const { page, sneakerTitle, storeObj, brands } = categoriesObj;
    try {
        const categoriesSet = new Set();
        if (brands && brands.length > 1 &&
            (!brands.map(brand => brand).includes("ADIDAS") && !brands.map(brand => brand).includes("Y-3")) &&
            (!brands.map(brand => brand).includes("NIKE") && !brands.map(brand => brand).includes("NIKE SB"))
        ) {
            categoriesSet.add('COLLABS');
        }

        if (storeObj.name === "Netshoes") {
            const rawCategories = await page.evaluate((categoriesSelector) => {
                const scriptElements = document.querySelectorAll(categoriesSelector);
                for (const scriptElement of scriptElements) {
                    if (scriptElement.textContent.includes('"categories":')) {
                        const regex = /"categories":\[\{.*?\}\]/;
                        const match = scriptElement.textContent.match(regex);
                        if (match) {
                            return match[0];
                        }
                    }
                }
            }, storeObj.selectors.categories);

            const regex = /"name":"(.*?)"/g;
            let match;
            while (match = regex.exec(rawCategories)) {
                categoriesSet.add(match[1].toUpperCase());
            }
        }

        const regex = new RegExp('\\b(' + categoryRegex.source + ')\\b', 'gi');
        const match = sneakerTitle.toLowerCase().match(regex);
        if (match) {
            for (let i = 0; i < match.length; i++) {
                categoriesSet.add(match[i]
                    .replace(' ', '-')
                    .replace("tenis", "tênis")
                    .replace("ténis", "tênis")
                    .replace("dunk", "tênis")
                    .replace("one-star", "tênis")
                    .replace("all-star", "tênis")
                    .replace("blazer", "tênis")
                    .replace("zoom", "tênis")
                    .replace("plexus", "tênis")
                    .replace("gtx", "gore-tex")
                    .replace("boot", "bota")
                    .replace("sst", "bota")
                    .replace("adilette", "chinelo")
                    .replace("slide", "chinelo")
                    .replace("sean wotherpoon", "sean-wotherspoon")
                    .toUpperCase());
            }
        } else {
            if (storeObj.name === "Maze") {
                const haveCategory = await page.$('a.section[href="/categoria/tenis"]', { timeout: 2000 });
                if (haveCategory) {
                    const category = await page.$eval('a.section[href="/categoria/tenis"]', el => el?.innerText.trim());
                    categoriesSet.add(category.toUpperCase());
                }
            }
        }

        if (storeObj.name === "Sunika") {
            const categories = await page.evaluate(() => {
                return product.CategoryItems
            });

            for (let i = 0; i < categories.length; i++) {
                categoriesSet.add(categories[i].Name.toUpperCase());
            }
        }

        if (storeObj.name === "CDR") {
            const cdrCategory = await page.$$eval('.breadcrumbs.borda-alpha ul li a', (els) => {
                return els[1].innerText.toUpperCase();
            });

            categoriesSet.add(cdrCategory);
        }

        badCategories.forEach(category => {
            categoriesSet.delete(category);
        });

        return [...categoriesSet];
    } catch (error) {
        console.error("Error getting categories:", error);
    }
}

module.exports = {
    getCategories,
    categoryRegex
}