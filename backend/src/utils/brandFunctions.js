const { removeAccents, removeDots } = require('./stringManipulation');

const brandRegex = /(dc comics|dc|adidas|nike sb|nike|air max|air force|dunk sb|new balance|asics|reebok|jordan|kappa|vans|randomevent|mizuno|wave rider|w rider|court rider|olympikus|puma|saucony|cariuma|columbia|fila|oakley|tesla|ous|the north face|piet|marvel|caloi cross|converse|chuck taylor|rider|stussy|stüssy|crocs|golden goose|hoka|on running|superga|under armour|vert|ballaholic|apc|nation|circoloco|disney|human made|m&ms|rich mnisi|sean wotherspoon|sean wotherpoon|hot wheels|clarks originals|ronnie fieg 8th street|salehe bembury|pharrell williams|highsnobiety|pleasures|bob esponja|mansur gavriel|sneeze|aries|qix|redley|mad rats|hocks|champion)/ig;

async function getBrands(sneakerTitle) {
    try {
        const brandsSet = new Set();
        const regex = new RegExp('\\b(' + brandRegex.source + ')\\b', 'gi');
        const match = removeAccents(removeDots(sneakerTitle)).toLowerCase().match(regex);

        if (match) {
            for (let i = 0; i < match.length; i++) {
                brandsSet.add(match[i]
                    .replace(/chuck taylor/gi, 'converse')
                    .replace('dunk sb', 'nike sb')
                    .replace('air max', 'nike')
                    .replace('air force', 'nike')
                    .replace('stüssy', 'stussy')
                    .replace('vert', 'veja')
                    .replace('wave rider', 'mizuno')
                    .replace('w rider', 'mizuno')
                    .replace('court rider', 'puma')
                    .replace('nation', 'p.e nation')
                    .replace('apc', 'A.P.C.')
                    .replace("sean wotherpoon", "sean wotherspoon")
                    .toUpperCase());
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