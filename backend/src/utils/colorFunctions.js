const colorsRegex = /(gum4|colorido|vtgi|wshp|ght|grethr|borang|owhite|mork|astral glow|mesa|storm|surf|pantone|panton|animal pack|animal print|patchwork|castanho|colorblock|canvas cobblestone|liquify avocado|board|camel|mesclado|mesc|malbec|camu|camuflado|mrsm|marshmallow|checkerboard|checkerbo|check|chckrb|chckbrd|ice|clowhi|crewht|crywht|ftwwht|cwhite|all white|true white|truewhite|off white|raw white|glow in the dark|dark grey|dark olive|sidestripeblack|pirate black|black contrast|cblack|black carbon|faux black|all black|skin black|forged iron|mineral gray|frost gray|frost|vaporous gray|city grey|athletic grey|cinza esc|cinza claro|tons de cinza|arctic|moonlight blue|crystal blue|navy blue|dress blues|grigio escuro|summit gold|june bag|dark purple|plum purple|multi|multicolor|pb|uv|reflect|reflex|reflective|refletivo|reflection|furtacor|camo|battleship white|natural white|white|wht|nuvem|egret|creme|bc bauni|cream|buttercream|chantilly|branco|alloy|bc\.neve|bco neve|sea salt|birch|perola|pearl|gelo|prata|silver|notorio|black|latex|ltx|preto|pto carvao|blk|gum|rubber|ivory|grey|glacier|talc|cinza|nimbus|magnet|iron|cz outono|tbwf|cz nuv|rock|eclipse|grafite|graphite|dark pewter|chumbo|grefiv|sand|areia|quarry|rosa claro|rosa|strawberry latte|stone blush knit|blush|rose|rosê|pink|chicle|berry|pebble|azul|midnight|denim|cobalt|nindig|heather|capri|sky|lago drive|tiffany|ciano|cyan|turquesa|acqua|aquatic|algiers blue|blue|prloin|indigo|canvas stormy weather|tecind|royal|dark navy|navy|naval|marinho|salute|lilás|lilac|aster|lavander|roxo|purple|salmão|prairie|haze coral|athletic red|racing red|mineral red|red|actmar|vermelho|verm\.esc|boltred|tinto|bordo|new khaki|khaki|workwear|café|cafe|ocre|fawn|whisky|caqui|deserto|yellow|yellowray|goldenglow|amarelo ouro|amarelo|angora|gold|goldbeam|dijon|colmeia|narcissus|verde limão|verde|fresh mint|esmerald|neon|acid buzz|halfgreen|dark green|dark moss|green|prlogr|lime|teal|floresta|fatigue|oliva|mistyc|misty|olive|orange|harvest-pumpkin|harvest|vm tel|laranja|rust|alaska|mostarda|mustard|brown|maroon|mar|marrom|earth strata|brostr|mel queimado|glazed ginger|demitasse|cork|caramelo|caramel|butternut|root beer|chipmunk|bege claro|bege|beige|linen|hay|dftw|dune|amêndoa|pecan|lbrown|vinho|cherry|mulberry|bwt|byo|olv|wlm|kkg|xkwr|bcm|hdv|xswb|wbk|gb2|abb|xccn|wtk|hbw|blg|blw|bbw|bwb|dn1|xskb|nwd|xkcc|wlk|xskr|glored|selubl)/ig;

const referenceColorsMap = {
    // ------------------------------- ADIDAS ----------------------------------
    "ID5831": ["PRETO"],
    "IF6225": ["AMARELO", "ROXO", "PRATA"],
    "ID6264": ["CREME", "AMARELO", "VERDE ESCURO", "MARROM"],
    "IG3555": ["BEGE"],
    "IF3509": ["AZUL MARINHO", "AMARELO"],
    "IG6192": ["VERDE", "BRANCO", "GUM"],
    "IG6212": ["AZUL", "BRANCO"],
    "ID0477": ["VINHO", "CREME"],
    "IF8832": ["BEGE", "BRANCO", "PRETO"],
    "GV9544": ["CREME", "BRANCO", "PRETO", "CINZA"],
    "IF8823": ["VERDE", "BRANCO", "PRETO"],
    "IG6211": ["BRANCO", "PRETO", "VERMELHO"],
    "ID0572": ["BRANCO", "LARANJA CLARO"],
    "IG8523": ["BRANCO", "VERDE"],
    "IF3447": ["BRANCO", "CINZA", "AZUL"],
    "FY7756": ["BRANCO", "AZUL ROYAL"],
    "B75806": ["BRANCO", "PRETO", "CINZA", "GUM"],
    "B75807": ["PRETO", "BRANCO", "GUM"],
    "BB5476": ["PRETO", "BRANCO"],
    "IG3755": ["BRANCO", "AZUL ROYAL"],
    "IG3754": ["BRANCO"],
    "IF8821": ["VINHO", "PRETO", "BRANCO"],
    "ID8265": ["PRETO", "BRANCO"],
    "HQ4452": ["PRETO", "BRANCO", "AZUL", "VERMELHO"],
    "CQ2809": ["PRETO"],
    "FY7755": ["BRANCO"],
    "IG8788": ["AREIA", "BEGE", "MARROM"],
    "IF8825": ["PRETO", "VERMELHO"],
    "ID5738": ["MARROM"],
    "GV9766": ["PRETO"],
    "IE7203": ["PRETO", "GUM"],
    "EG4958": ["BRANCO", "PRETO"],
    "FV1226": ["AMARELO", "AZUL", "GUM"],
    "ID2094": ["BRANCO", "ROXO", "PRETO"],
    "ID2077": ["MARROM"],
    "ID2064": ["PRETO", "REFLETIVO"],
    "IF5165": ["BEGE", "CREME", "PRATA"],
    "IE7217": ["CINZA CLARO", "BRANCO", "PRETO"],
    "FY9042": ["BRANCO"],
    "EG4959": ["PRETO", "BRANCO"],
    "ID2076": ["VINHO"],
    "GY5832": ["BRANCO", "ROSA CLARO", "LILÁS"],
    "GX4617": ["BRANCO", "LILÁS"],
    "GV7685": ["BEGE", "REFLETIVO"],
    "ID9583": ["VERDE OLIVA", "PRETO"],
    "IG3047": ["VERDE OLIVA", "PRETO"],
    "IE7269": ["CREME", "AZUL TIFFANY", "LARANJA CLARO"],
    "GW2043": ["BRANCO", "VERMELHO"],
    "ID1849": ["CREME", "AZUL MARINHO"],
    "GZ9416": ["PRETO", "VERDE"],
    "GX8433": ["PRETO"],
    "GZ9421": ["CINZA ESCURO", "PRATA", "AZUL CLARO", "BRANCO", "ROSA CLARO"],
    "ID2101": ["PRETO", "BRANCO"],
    "IE9727": ["BRANCO", "AZUL TIFFANY", "AMARELO CLARO"],
    "IF2852": ["BRANCO", "CINZA CLARO", "GUM"],
    "IG7515": ["PRETO", "REFLETIVO"],
    "IG7497": ["AZUL ESCURO"],
    "ID9432": ["PRETO", "BRANCO"],
    "ID9596": ["BRANCO", "PRATA", "PRETO", "AZUL CLARO", "VERDE NEON"],
    "IE9669": ["VERDE NEON", "LARANJA", "AZUL CLARO"],
    "HP3130": ["BRANCO"],
    "ID9442": ["PRETO", "BRANCO"],
    "ID9587": ["BRANCO", "PRATA", "AZUL CLARO", "VERDE NEON"],
    "IE9701": ["AZUL CLARO", "AZUL ROYAL", "VERDE NEON"],
    "FZ6411": ["VERDE NEON"],
    "FZ6473": ["BRANCO"],
    "FU8297": ["BRANCO", "PRETO"],
    "HQ1837": ["AZUL CLARO", "CINZA", "BRANCO"],
    "HP6376": ["AZUL ESCURO", "BRANCO", "VERMELHO"],
    "HQ4376": ["VERDE OLIVA"],
    "HP6337": ["CINZA CLARO", "BRANCO", "PRATA"],
    "HP2200": ["PRETO"],
    "HP6365": ["BRANCO", "AZUL ROYAL", "PRETO"],
    "HP6364": ["PRETO", "BRANCO", "CINZA ESCURO"],
    "GX4414": ["BRANCO", "AZUL ROYAL"],
    "GW9381": ["PRETO"],
    "HQ1984": ["BRANCO", "PRETO", "CREME"],
    "H06415": ["PRETO"],
    "GX1979": ["PRETO"],
    "GW5698": ["PRETO", "BRANCO"],
    "GB7034": ["BRANCO"],
    "GB7036": ["BRANCO", "PRETO"],
    "GB7035": ["BRANCO", "AZUL ROYAL"],
    "GZ6196": ["PRETO", "DOURADO"],
    "GW9462": ["CINZA", "ROSA"],
    "GW9463": ["PRETO", "BRANCO", "LARANJA"],
    "GY6987": ["BRANCO", "ROSA CLARO"],
    "GW6809": ["BRANCO"],
    "GY5921": ["BRANCO", "PRETO"],
    "FY4975": ["BRANCO"],
    "FX5502": ["BRANCO", "VERDE"],
    "EG4960": ["BRANCO"],
    "EW2053": ["PRETO", "BRANCO"],
    "280647": ["PRETO", "BRANCO"],
    "IU6662": ["PRETO", "BRANCO"],
    "IH5181": ["VINHO", "BRANCO"],
    "IE9634": ["PRETO", "MULTICOLORIDO"],
    "IE3103": ["PRETO", "BRANCO"],
    "IE3126": ["MARROM", "BRANCO"],
    "GW6930": ["BRANCO", "PRETO"],
    "IH5180": ["AZUL ESCURO", "BRANCO"],
    "IE3101": ["BRANCO", "AZUL TURQUESA", "GUM"],
    "IG6260": ["PRETO", "AZUL CLARO"],
    "IH5178": ["CHUMBO", "PRETO", "GUM"],
    "IH5183": ["PRETO", "BRANCO"],
    "IF3668": ["BRANCO", "PRETO"],
    "HP9088": ["BRANCO", "PRETO", "GUM"],
    "IG5270": ["PRETO", "BRANCO"],
    "IE3093": ["CINZA", "AZUL CLARO", "GUM"],
    "IF0071": ["PRETO", "BRANCO", "REFLETIVO"],
    "IF3670": ["PRETO", "BRANCO"],
    "IH5176": ["VERMELHO", "BRANCO", "GUM"],
    "IG5273": ["BRANCO"],
    "FU8299": ["AZUL MARINHO", "BRANCO"],
    "HQ2014": ["BRANCO", "AZUL MARINHO"],
    "IE4762": ["BRANCO", "LILÁS"],
    "IH5182": ["VERDE ESCURO", "BRANCO"],
    "HP9093": ["BRANCO", "AZUL TIFFANY", "ROXO"],
    "HP9092": ["PRETO", "AZUL TIFFANY", "BRANCO", "VERMELHO"],
    "HP9106": ["BRANCO"],
    "HP9089": ["AZUL", "BRANCO", "PRETO"],
    "HQ6433": ["BRANCO", "PRETO"],
    "FY7757": ["BRANCO", "PRETO"],
    "HR0073": ["VERDE OLIVA", "BRANCO", "GUM"],
    "IH0895": ["AZUL INDIGO", "BRANCO", "VERMELHO"],
    "HQ7111": ["CINZA", "AZUL TURQUESA"],
    "HQ1853": ["BRANCO", "AZUL TURQUESA"],
    "HQ6154": ["BEGE"],
    "IE1841": ["AZUL CLARO", "PRETO"],
    "IE4775": ["BRANCO", "ROSA CLARO", "MARROM CLARO", "AMARELO"],
    "FZ6024": ["PRETO", "VERMELHO", "BRANCO"],
    "ID5105": ["LARANJA", "CORAL"],
    "ID5107": ["BEGE", "LARANJA", "CORAL"],
    "GW3248": ["MARROM", "LARANJA", "ANIMAL PRINT", "GUM"],
    "GX9682": ["BRANCO", "AMARELO", "AZUL", "ROXO", "VERMELHO"],
    "ID9765": ["PRETO", "ROXO"],
    "HQ1985": ["BRANCO", "ANIMAL PRINT"],
    "GG3949": ["BRANCO", "ROSA", "GUM"],
    "GZ9183": ["ROXO", "CINZA", "CORAL", "REFLETIVO"],
    "ID7440": ["BRANCO", "AZUL ROYAL"],
    "HQ4650": ["VERDE"],
    "HP6489": ["BEGE", "GUM"],

    // ------------------------------- NEW BALANCE ----------------------------------
    "U574LGGB": ["PRETO"],
    "U9060VNY": ["AMARELO", "BRANCO"],
    "BBW550DP": ["BRANCO", "VINHO", "ROSA CLARO"],
    "M2002RFB": ["CINZA", "AZUL CLARO"],
    "M2002RDQ": ["AREIA"],
    "BBW550NB": ["BRANCO", "AZUL CLARO", "ROXO", "GUM"],
    "MR530RB": ["BRANCO", "VERDE"],
    "BBW550ST": ["BRANCO", "BEGE", "LARANJA", "CREME"],
    "U9060PH": ["VERDE ESCURO", "MARROM"],
    "MS327WI": ["AZUL MARINHO", "MARROM", "CINZA"],
    "M1906RRA": ["LICORICE"],
    "M2002RDO": ["AZUL MARINHO"],
    "MR530RA": ["BRANCO", "CINZA CLARO", "AZUL CLARO"],
    "U9060VNA": ["WASHED BURGUNDY"],
    "UWRPDV1": ["BRANCO"],
    "U997RCD": ["AZUL CLARO", "BRANCO"],
    "M5740FMB": ["BRANCO"],
    "BBW550NP": ["BRANCO", "ROSA CLARO", "AZUL", "VERMELHO", "GUM"],
    "U327WBA1": ["MARROM"],
    "BB550PHA": ["MARROM"],
    "BB550PWD": ["BRANCO", "BEGE"],
    "U327WCI": ["MARROM", "BEGE"],
    "BBW550DY": ["BRANCO", "AZUL"],
    "BB550PHD": ["CINZA"],
    "MT580VE2": ["PRETO", "VERDE ESCURO"],
    "U327WCH": ["PRETO"],
    "BB550PWG": ["BRANCO", "BEGE"],
    "M2002RSB": ["CINZA", "LARANJA"],
    "U327TF": ["CINZA", "BRANCO"],
    "MT580VA2": ["CINZA ESCURO", "AZUL TURQUESA", "ROXO", "BEGE"],
    "BB550VTB": ["BEGE", "VERMELHO", "PRETO"],
    "MS237YB": ["PRETO", "CINZA ESCURO", "BRANCO", "GUM"],
    "BB550VND": ["VERMELHO", "BRANCO"],
    "U327WLD": ["AZUL ESCURO", "AZUL TURQUESA", "AMARELO"],
    "U327WLB": ["PRETO", "CINZA", "BRANCO"],
    "MT580RTB": ["MARROM", "VERDE ESCURO"],
    "BB650RCE": ["BRANCO", "PRETO"],
    "BB550ESA": ["BRANCO", "AZUL", "CINZA", "GUM"],
    "W5740SD": ["CINZA", "AZUL", "LARANJA"],
    "U574LGNW": ["VERDE ESCURO", "CINZA"],
    "U327WCB": ["AZUL INDIGO", "BRANCO"],
    "BB550ESC": ["BRANCO", "CINZA", "GUM"],
    "U997REC": ["PRETO", "BRANCO", "VERDE", "AMARELO"],
    "BB550ESB": ["BRANCO", "VERDE", "CINZA", "GUM"],
    "U997REB": ["BRANCO", "CINZA", "ROXO", "VERMELHO"],
    "NM440BNG": ["PRETO", "BRANCO", "GUM"],
    "BBW550BH": ["BRANCO", "PRETO"],
    "NM272GGB": ["PRETO"],
    "NM1010WB": ["BRANCO", "PRETO"],
    "NM1010SB": ["PRETO", "BRANCO", "GUM"],
    "NM808TNB": ["BRANCO", "GUM"],
    "NM425BNT": ["PRETO", "MOSTARDA", "BRANCO", "GUM"],
    "NM808CLK": ["PRETO", "GUM"],
    "BB650RWH": ["BRANCO", "CINZA", "PRETO"],
    "M5740MC1": ["VERMELHO", "CINZA ESCURO", "BRANCO"],
    "BBW550DB": ["BRANCO", "BEGE", "AZUL", "ROSA CLARO", "AMARELO CLARO", "GUM"],
    "NM272SKA": ["PRETO", "BRANCO"],
    "BB550PRA": ["PRETO", "CINZA", "BRANCO"],
    "M2002RDP": ["KHAKI"],
    "NM272PAN": ["BRANCO", "PRETO"],
    "U9060NRI": ["PRETO"],
    "NM808LGC": ["VERDE ESCURO", "PRETO", "AZUL CLARO", "BRANCO"],
    "NM1010RF": ["KHAKI", "PRETO", "GUM"],
    "NM598ASR": ["PRETO", "BRANCO", "GUM"],
    "M5740VPD": ["BEGE", "CINZA", "BRANCO"],

    // ------------------------------- REEBOK -------------------------------------------
    "100033434": ["BLACK", "SOLAR ACID YELLOW", "WHITE"],

    // ------------------------------- VANS ---------------------------------------------
    "VN000CQ95SM": ["WHITE", "BEIGE"],
    "VN0A3AV8QXH": ["QUADRICULADO"],
    "VN000D5IBMB": ["MULTICOLORIDO"],

    // ------------------------------- ASICS --------------------------------------------
    "1203A416\.100": ["CREME", "PRETO", "MARROM"],
    "1201A482\.102": ["BEGE", "VERMELHO"],

    // ------------------------------- CONVERSE -----------------------------------------
    "CT09550001": ["AMARELO OURO"],
    "CT04940004": ["BORDO", "PRETO", "BRANCO"],
    "CT09550005": ["BEGE CLARO"],

    // ---------------------------------- NIKE ------------------------------------------
    "0CD2569-600": ["VERMELHO", "PRETO"],
    "511416-104": ["BRANCO", "CINZA", "PRETO", "VERMELHO"],
    "0DM0587-100": ["BEGE", "MARROM"],
    "AQ1774102": ["BRANCO", "PRETO"],
    "DV5477-401": ["PRETO", "BRANCO", "AZUL"],
    "DV5477-700": ["PRETO", "BRANCO", "AMARELO"],
    "CJ0882-104": ["BRANCO", "PRETO", "AZUL", "GUM"],
    "CJ0882-500": ["BRANCO", "PRETO", "AZUL CLARO"],
    "CQ0369-102": ["BRANCO", "LILÁS"],
    "AQ7878-003": ["PRETO", "MULTICOLORIDO"],
    "BQ5448-005": ["BRANCO", "PRETO", "LILÁS"],
    "861533-101": ["BRANCO", "CINZA CLARO"],
    "838938-104": ["BRANCO", "PRETO", "VERMELHO"],
    "844881-006": ["CINZA"],
    "DV5456-500": ["LILÁS"],
    "DD1391-702": ["AMARELO", "ROXO"],
    "CW1590-600": ["BRANCO", "VERMELHO"],
    "DQ3757-300": ["VERDE", "PRETO", "BRANCO"],
    "DR0156-300": ["VERDE", "BRANCO", "ANIMAL PRINT"],
    "DZ5350-288": ["MARROM"],
    "DQ7683-001": ["PRETO", "BRANCO"],
    "DR0156-800": ["LARANJA", "BRANCO", "ANIMAL PRINT"],
    "DM0121-400": ["AZUL", "BRANCO"],
    "DX3374-700": ["MARROM", "GUM"],
    "DV0833-800": ["AZUL", "LARANJA"],
    "CZ2205-700": ["MOSTARDA", "MARROM", "BRANCO", "VERMELHO", "VERDE"],
    "DX3382-400": ["AZUL CLARO", "BRANCO", "AMARELO"],
    "DO9394-100": ["BEGE", "PRETO", "VERMELHO"],
    "DV4024-200": ["BEGE"],
    "DR9705-100": ["VINHO", "BRANCO", "ROSA"],
    "DQ7579-600": ["VINHO"],
    "FJ7707-131": ["BRANCO", "AZUL TURQUESA", "MULTICOLORIDO"],
    "DV5429-600": ["VERMELHO", "GUM"],
    "DV3887-400": ["AZUL MARINHO", "VERDE", "BRANCO", "GUM"],
    "DR2550-100": ["BRANCO", "PRETO"],
    "DZ0795-102": ["BRANCO", "PRETO", "VERDE"],
    "DX5883-100": ["BRANCO"],
    "DR0148-101": ["BRANCO", "PRETO", "BEGE"],

    // ---------------------------------- FILA ------------------------------------------
    "01001492": ["BRANCO"],
    "0991802": ["PRATA", "VERDE LIMÃO", "CORAL"],
    "1172699": ["BEGE", "BRANCO"],


    // ---------------------------------- PUMA ------------------------------------------
    "384958-06": ["BRANCO", "PRETO", "AZUL TURQUESA", "VERDE LIMÃO", "ROSA"],
    "384958-04": ["BRANCO", "CORAL", "CINZA"]
};

const ostoreColorsMap = {
    "000000": "PRETO",
    "FFFFFF": "BRANCO",
    "0192D3": "AZUL",
    "FFDEAD": "BEGE",
    "D8D8D8": "CINZA",
    "F5F51B": "AMARELO",
    "228B22": "VERDE",
    "FF0000": "VERMELHO",
    "D2691E": "MARROM",
    "732E30": "VINHO",
    "FC0FC0": "ROSA",
    "FF8C00": "LARANJA",
    "800080": "ROXO",
};

function getColorsFromSneakerTitle(sneakerTitle) {
    const colors = [];
    const lowerCaseString = sneakerTitle.toLowerCase();
    const regex = new RegExp('\\b' + colorsRegex.source + '\\b', 'gi');
    const match = lowerCaseString.match(regex);
    if (match) {
        for (let i = 0; i < match.length; i++) {
            colors.push(match[i].toUpperCase());
        }
    }
    return colors;
}

function getColorsByProductReference(productReference) {
    const colors = [];
    for (const reference in referenceColorsMap) {
        if (referenceColorsMap.hasOwnProperty(reference)) {
            if (reference === productReference) {
                referenceColorsMap[reference].forEach(color => colors.push(color));
            }
        }
    }
    return [...colors];
}

function processColorsString(colorsString) {
    if (colorsString.includes(', ')) {
        return colorsString.split(', ');
    } else {
        let colors = colorsString.split(/(?![^,]+(?:,|$))\s+/);
        colors = colors.filter(color => color.trim() !== '').filter((color, index, self) => self.indexOf(color) === index);
        return colors;
    }
}

async function getColors(colorsObj) {
    const { page, storeObj, sneakerTitle, productReference } = colorsObj;

    try {
        const colorsSet = new Set();

        if (storeObj.name === "Netshoes") {
            const colorsElements = await page.$eval(storeObj.selectors.colors, (el) => el?.innerText.trim());
            if (colorsElements) {
                const rawColors = colorsElements.match(/[A-ZÀ-ÖØ-Ý]?[a-zà-öø-ý]+(?:\s+[A-ZÀ-ÖØ-Ý][a-zà-öø-ý]+)*/g).join(", ").replace(', e', ',').split(', ');
                rawColors.forEach(color => {
                    color = processColorsString(color);
                    color.forEach(colorVariant => colorsSet.add(colorVariant.toUpperCase()));
                });
            }
        }

        if (storeObj.name === "Ostore") {
            const styleAttribute = await page.$eval(storeObj.selectors.colors, (el) => el?.getAttribute('style').toUpperCase().replace('#', ''));
            const match = styleAttribute.match(/[0-9A-Fa-f]{6}/g);
            if (match) {
                for (let i = 0; i < match.length; i++) {
                    ostoreColorsMap[match[i]] && colorsSet.add(ostoreColorsMap[match[i]]);
                }
            } else {
                styleAttribute.includes('BRANCO-PRETO') && colorsSet.add(['BRANCO', 'PRETO']);
                styleAttribute.includes('PICTUREMESSAGE_KSUXD5KR') && colorsSet.add('MULTICOLORIDO');
                styleAttribute.includes('UNDEFINED') && colorsSet.add(getColorsByProductReference(productReference));
            }
        }

        if (storeObj.name === "RatusSkateshop") {
            const colorsElement = await page.$eval(storeObj.selectors.colors, (el) => el?.innerText.trim());
            if (colorsElement) {
                colorsSet.add(colorsElement.toUpperCase());
            }
        }

        if (storeObj.name === "Sunika") {
            const colorsElements = await page.$eval(storeObj.selectors.colors, (el) => el?.innerText.split('/').map(color => color.trim()));
            colorsElements.forEach(color => {
                color = processColorsString(color);
                color.forEach(colorVariant => colorsSet.add(colorVariant.toUpperCase()));
            });
        }

        if (storeObj.name === "WallsGeneralStore") {
            const colorsElement = await page.$eval(storeObj.selectors.colors, (el) => {
                if (el) {
                    const match = el.innerHTML.toLowerCase().match(/cor:\s*(.*?)<\/li>/i);
                    if (match) {
                        return match[1].trim();
                    }
                }
            });

            if (colorsElement) {
                colorsSet.add(colorsElement.toUpperCase());
            }
        }

        if (storeObj.name === "CDR" || storeObj.name === "SunsetSkateshop") {
            const titleColors = getColorsFromSneakerTitle(sneakerTitle);
            const referenceColors = getColorsByProductReference(productReference);

            referenceColors.forEach(color => {
                color = processColorsString(color);
                color.forEach(colorVariant => colorsSet.add(colorVariant.toUpperCase()));
            });

            titleColors.forEach(color => {
                color = processColorsString(color);
                color.forEach(colorVariant => colorsSet.add(colorVariant.toUpperCase()));
            });
        }

        const colorsArray = Array.from(colorsSet);
        return [...colorsArray];
    } catch (error) {
        console.error("Error getting colors:", error);
    }
}

module.exports = {
    colorsRegex,
    getColorsByProductReference,
    getColors
}