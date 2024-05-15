const { removeAccents, removeDots } = require('./stringManipulation');

const brandRegex = /(dc comics|dc|adidas|y-3|y3|nike sb|nike|air max|air force|dunk sb|new balance|asics|reebok|jordan|kappa|vans|randomevent|mizuno|muzuno|olympikus|puma|saucony|cariuma|columbia|fila|oakley|tesla|ous|the north face|piet|marvel|caloi cross|converse|chuck taylor|rider|stussy|stüssy|crocs|golden goose|hoka|on|superga|under armour|vert|veja|ballaholic|apc|nation|circoloco|disney|human made|m&ms|rich mnisi|sean wotherspoon|sean wotherpoon|hot wheels|clarks originals|ronnie fieg 8th street|salehe bembury|pharrell williams|highsnobiety|pleasures|bob esponja|mansur gavriel|sneeze|aries|qix|redley|mad rats|hocks|champion|fear of god|lacoste|ambush)/ig;

async function getBrands(brandsObj) {
    const { sneakerTitle } = brandsObj;
    try {
        const brandsSet = new Set();
        const regex = new RegExp('\\b(' + brandRegex.source + ')\\b', 'gi');
        const match = removeAccents(removeDots(sneakerTitle)).toLowerCase().match(regex);

        if (match) {
            for (let i = 0; i < match.length; i++) {
                if (match[i] === 'rider') {
                    if (
                        sneakerTitle.toLowerCase().includes('chinelo') ||
                        sneakerTitle.toLowerCase().includes('papete') ||
                        sneakerTitle.toLowerCase().includes('slide') ||
                        sneakerTitle.toLowerCase().includes('sandália') ||
                        sneakerTitle.toLowerCase().includes('sandalia') ||
                        sneakerTitle.toLowerCase().includes('mule') ||
                        sneakerTitle.toLowerCase().includes('piet')
                    ) {
                        brandsSet.add(match[i].toUpperCase());
                    }

                } else if (match[i] === 'on') {
                    if (
                        !sneakerTitle.toLowerCase().includes('slip on') &&
                        !sneakerTitle.toLowerCase().includes('slip-on') &&
                        !sneakerTitle.toLowerCase().includes('slip') &&
                        !sneakerTitle.toLowerCase().includes('sandália') &&
                        !sneakerTitle.toLowerCase().includes('sandalia') &&
                        !sneakerTitle.toLowerCase().includes('chinelo')
                    ) {
                        brandsSet.add("ON RUNNING");
                    }
                } else {
                    brandsSet.add(match[i]
                        .replace(/chuck taylor/gi, 'converse')
                        .replace('dunk sb', 'nike sb')
                        .replace('air max', 'nike')
                        .replace('air force', 'nike')
                        .replace('stüssy', 'stussy')
                        .replace('vert', 'veja')
                        .replace('muzuno', 'mizuno')
                        .replace('court rider', 'puma')
                        .replace('nation', 'p.e nation')
                        .replace('apc', 'A.P.C.')
                        .replace("sean wotherpoon", "sean wotherspoon")
                        .replace("y3", "y-3")
                        .replace("ambush", "AMBUSH®")
                        .toUpperCase());
                }
            }

            const brands = Array.from(brandsSet);
            return [...brands];
        }

    } catch (error) {
        console.error("Error getting brand:", error);
    }
}

module.exports = {
    getBrands,
    brandRegex
}