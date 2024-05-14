const { Sneaker: SneakerModel } = require("../models/Sneaker");
const { removeAccents, removeDots } = require('../src/utils/stringManipulation');
const { clearSneakerName } = require('../src/utils/titleFunctions');

const coresRegex = {
    "azul": /azul|blue|astral glow|turquesa|turquoise|aqua|storm|alaska|hongo bros|shanahan importado|scuba|teal|jade|heather|mistyc|misty|surf|prloin|navy|naval|marinho|aquatic|royal|indigo|vtgi|nindig|tecind|stormy|tiffany|cobalt|denim|sky|capri|lago drive|agosto|salute|selubl|blues|midnight|acqua|bwt|xswb|abb|dn1|xskb|wlk|obsidian|hyper/i,
    "cinza": /cinza|grey|gray|frost|astral glow|hongo bros|shanahan importado|mork|sea|salt|ice|quarry|magnet|cz|tbwf|egret|nuvem|glacier|gelo|nimbus|arctic|grigio|iron|rock|talc|satelite|grethr|chumbo|grefiv|grafite|graphite|dark pewter|eclipse|cobblestone|bwt|xswb|blg|xskb|nwd|xskr|dust/i,
    "branco": /branco|white|wht|allwhite|truewhite|rawwhite|clowhi|crywht|ftwwht|cwhite|reflection|frost|castanho|pb|sidestripeblack|astral glow|shanahan importado|bc\.neve|alloy|bco neve|sea|salt|orquidea|birch|ice|capri|bwt|wlm|xkwr|hdv|xswb|wbk|wtk|hbw|blw|bbw|bwb|nwd|wlk/i,
    "preto": /preto|black|reflection|frost|castanho|pb|sidestripeblack|alaska|verona slip prm|ltx|latex|blk|cblack|ght|pto carvao|blackout|scuba|nomade essencial|skate hockey|original 3|notorio|bwt|byo|kkg|xkwr|bcm|wbk|gb2|abb|wtk|blg|blw|bbw|bwb|xskb|xkcc|xskr|summit|photon/i,
    "marrom": /marrom|mar|brown|workwear|mesa|canhamo|caramelo|caramel|mel queimado|lbrown|camel|maroon|butternut|cafe|deserto|whisky|colmeia|chipmunk|root beer|demitasse|cork|ginger|pecan|earth|brostr|xccn|dn1|xkcc|summit/i,
    "verde": /verde|green|storm|mint|prlogr|june bag|avocado|floresta|fatigue|dark moss|oliva|olive|teal|neon|lime|limão|limao|buzz|halfgreen|esmerald|olv|wlm|hdv|emerald/i,
    "off-white": /off-white|off white|offwhite|crewht|owhite|bc bauni|bc baun|buttercream|chantilly|marshmallow|mrsm|creme|cream|ivory|perola|pearl|board|mork/i,
    "bege": /bege|beige|workwear|storm|sea|salt|birch|pebble|linen|dftw|canhamo|goldbeam|amêndoa|amendoa|hay|phantom/i,
    "multicolorido": /multicolorido|multicolor|colorido|multi|colorblock|patchwork|mesclado|mesc|castanho/i,
    "amarelo": /amarelo|yellow|hongo bros|capri|goldenglow|yellowray|narcissus|angora|byo|bcm|gb2/i,
    "quadriculado": /quadriculado|quadriculada|chckrb|checkerbo|chckbrd|checkerboard|check/i,
    "rosa": /rosa|pink|aster|wshp|rose|rosê|blush|chicle|chiclete|strawberry latte|berry/i,
    "laranja": /laranja|orange|mesa|storm|scuba|pumpkin|vm tel|harvest|rust|borang|xccn|picante/i,
    "vermelho": /vermelho|red|actmar|glored|boltred|verm\.esc|capri|xkwr|wtk|xskr/i,
    "khaki": /khaki|workwear|caqui|narcissus|canhamo|deserto|whisky|colmeia/i,
    "salmao": /salmao|salmão|salmon|prairie|haze coral|mineral red|summit/i,
    "vinho": /vinho|wine|bordo|malbec|tinto|mulberry|cherry/i,
    "refletivo": /refletivo|reflective|reflect|reflex/i,
    "lilas": /lilas|lilac|lilás|board|lavander|aster/i,
    "camuflado": /camuflado|camuflada|camo|camu|bcm/i,
    "dourado": /dourado|gold|golden|goldenglow|gb2|wheat/i,
    "animal print": /animal print|animal pack|mesa|hemp/i,
    "glow in the dark": /glow in the dark|gitd/i,
    "areia": /areia|sand|dune|deserto|whisky/i,
    "prata": /prata|silver|board|mork|birch/i,
    "roxo": /roxo|purple|astral glow|aster|photon/i,
    "mostarda": / mostarda|mustard|dijon/i,
    "furta-cor": /furtacor|furta cor/i,
    "gum": /gum|gum4|rubber|mesa|kkg|gun/i,
    "pantone": /pantone|panton/i,
    "ocre": /ocre|ochre|fawn/i,
    "uv": /uv/i,
};


const sneakerController = {
    getAll: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            let query = {};
            let sort = {};

            if (req.query.color) {
                const colors = typeof req.query.color === 'string' ? [req.query.color] : req.query.color;
                const colorQueries = colors.map(color => {
                    const regex = new RegExp('\\b' + coresRegex[color].source + '\\b', 'gi');;
                    if (regex) {
                        return { "colors": { $regex: regex } };
                    } else {
                        return null;
                    }
                }).filter(query => query !== null);

                if (colorQueries.length > 0) {
                    query.$or = colorQueries;
                }
            }

            if (req.query.size) {
                const sizes = typeof req.query.size === 'string' ? [req.query.size] : req.query.size;
                query.availableSizes = { $in: sizes };
            }

            if (req.query.store) {
                const stores = typeof req.query.store === 'string' ? [req.query.store] : req.query.store;
                query.store = { $in: stores };
            }

            if (req.query.brand) {
                const brands = typeof req.query.brand === 'string' ? [req.query.brand] : req.query.brand;
                query.brands = { $in: brands };
            }

            if (req.query.category) {
                const categories = typeof req.query.category === 'string' ? [req.query.category] : req.query.category;
                query.categories = { $in: categories };
            }

            if (req.query.minPrice || req.query.maxPrice) {
                const minPrice = parseFloat(req.query.minPrice) || 0;
                const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

                query.currentPrice = {
                    $gte: minPrice,
                    $lte: maxPrice
                };
            }

            if (req.query.orderBy) {
                const orderBy = req.query.orderBy;
                if (orderBy === "price-asc") {
                    sort = { currentPrice: 1 };
                }

                if (orderBy === "price-desc") {
                    sort = { currentPrice: -1 };
                }

                if (orderBy === "date-asc") {
                    sort = { createdAt: 1 };
                }

                if (orderBy === "date-desc") {
                    sort = { createdAt: -1 };
                }
            } else {
                sort = { createdAt: -1 };
            }

            const sneakers = await SneakerModel.find(query).sort(sort).limit(limit).skip(startIndex);

            const uniqueSneakers = [];
            const seenIds = new Set();

            sneakers.forEach(sneaker => {
                if (!seenIds.has(sneaker._id)) {
                    uniqueSneakers.push(sneaker);
                    seenIds.add(sneaker._id);
                }
            });

            const totalCount = await SneakerModel.countDocuments(query);
            const hasMore = endIndex < totalCount;

            res.json({
                sneakers: uniqueSneakers,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: hasMore,
                totalCount
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    },

    getAllStores: async (req, res) => {
        try {
            const response = [];
            const stores = await SneakerModel.distinct('store');
            for (let i = 0; i < stores.length; i++) {
                response.push({ id: i + 1, name: stores[i] });
            }

            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    },

    getAllBrands: async (req, res) => {
        try {
            const response = [];
            const brands = await SneakerModel.distinct('brands');
            for (let i = 0; i < brands.length; i++) {
                response.push({ id: i + 1, name: brands[i] });
            }

            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const response = [];
            const categories = await SneakerModel.distinct('categories');
            for (let i = 0; i < categories.length; i++) {
                response.push({ id: i + 1, name: categories[i] });
            }

            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    },

    get: async (req, res) => {
        try {
            const id = req.params.id;
            const sneaker = await SneakerModel.findOne({ _id: id });
            if (!sneaker) {
                res.status(404).json({ msg: "Sneaker não encontrado" });
                return;
            }
            res.json(sneaker);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    },

    getSimilar: async (req, res) => {
        try {
            const id = req.params.id;
            const sneaker = await SneakerModel.findOne({ _id: id });
            if (!sneaker) {
                res.status(404).json({ msg: "Sneaker não encontrado" });
                return;
            }

            let title = sneaker.sneakerTitle;
            title = await clearSneakerName({
                sneakerName: title,
                brands: sneaker.brands,
                categories: sneaker.categories,
                productReference: sneaker.productReference,
                colors: sneaker.colors
            });
            title = removeDots(title);
            title = removeAccents(title);
            title = title.replace(/[^\w\s]/gi, '')
            title = title.split(' ')
            console.log(title);

            const regex = new RegExp('\\b' + title + '\\b', 'gi');
            const similarSneakers = await SneakerModel.find({ _id: { $ne: sneaker._id }, sneakerTitle: { $regex: regex }, brands: { $in: sneaker.brands } });
            res.json(similarSneakers);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    },

    getStore: async (req, res) => {
        try {
            const store = req.params.store;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            let query = {
                store: store
            };
            let sort = {};

            if (req.query.color) {
                const colors = typeof req.query.color === 'string' ? [req.query.color] : req.query.color;
                const colorQueries = colors.map(color => {
                    const regex = new RegExp('\\b' + coresRegex[color].source + '\\b', 'gi');;
                    if (regex) {
                        return { "colors": { $regex: regex } };
                    } else {
                        return null;
                    }
                }).filter(query => query !== null);

                if (colorQueries.length > 0) {
                    query.$or = colorQueries;
                }
            }

            if (req.query.size) {
                const sizes = typeof req.query.size === 'string' ? [req.query.size] : req.query.size;
                query.availableSizes = { $in: sizes };
            }

            if (req.query.brand) {
                const brands = typeof req.query.brand === 'string' ? [req.query.brand] : req.query.brand;
                query.brands = { $in: brands };
            }

            if (req.query.category) {
                const categories = typeof req.query.category === 'string' ? [req.query.category] : req.query.category;
                query.categories = { $in: categories };
            }

            if (req.query.minPrice || req.query.maxPrice) {
                const minPrice = parseFloat(req.query.minPrice) || 0;
                const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

                query.currentPrice = {
                    $gte: minPrice,
                    $lte: maxPrice
                };
            }

            if (req.query.orderBy) {
                const orderBy = req.query.orderBy;
                if (orderBy === "price-asc") {
                    sort = { currentPrice: 1 };
                }

                if (orderBy === "price-desc") {
                    sort = { currentPrice: -1 };
                }

                if (orderBy === "date-asc") {
                    sort = { createdAt: 1 };
                }

                if (orderBy === "date-desc") {
                    sort = { createdAt: -1 };
                }
            } else {
                sort = { createdAt: -1 };
            }

            const sneakers = await SneakerModel.find(query).sort(sort).limit(limit).skip(startIndex);
            const totalCount = await SneakerModel.countDocuments(query);
            const hasMore = endIndex < totalCount;

            res.json({
                sneakers,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: hasMore,
                totalCount
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    },

    getBrand: async (req, res) => {
        try {
            const brand = req.params.brand;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            let query = {
                brands: brand
            };

            let sort = {};

            if (req.query.color) {
                const colors = typeof req.query.color === 'string' ? [req.query.color] : req.query.color;
                const colorQueries = colors.map(color => {
                    const regex = new RegExp('\\b' + coresRegex[color].source + '\\b', 'gi');;
                    if (regex) {
                        return { "colors": { $regex: regex } };
                    } else {
                        return null;
                    }
                }).filter(query => query !== null);

                if (colorQueries.length > 0) {
                    query.$or = colorQueries;
                }
            }

            if (req.query.size) {
                const sizes = typeof req.query.size === 'string' ? [req.query.size] : req.query.size;
                query.availableSizes = { $in: sizes };
            }

            if (req.query.store) {
                const stores = typeof req.query.store === 'string' ? [req.query.store] : req.query.store;
                query.store = { $in: stores };
            }

            if (req.query.category) {
                const categories = typeof req.query.category === 'string' ? [req.query.category] : req.query.category;
                query.categories = { $in: categories };
            }

            if (req.query.minPrice || req.query.maxPrice) {
                const minPrice = parseFloat(req.query.minPrice) || 0;
                const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

                query.currentPrice = {
                    $gte: minPrice,
                    $lte: maxPrice
                };
            }

            if (req.query.orderBy) {
                const orderBy = req.query.orderBy;
                if (orderBy === "price-asc") {
                    sort = { currentPrice: 1 };
                }

                if (orderBy === "price-desc") {
                    sort = { currentPrice: -1 };
                }

                if (orderBy === "date-asc") {
                    sort = { createdAt: 1 };
                }

                if (orderBy === "date-desc") {
                    sort = { createdAt: -1 };
                }
            } else {
                sort = { createdAt: -1 };
            }

            const sneakers = await SneakerModel.find(query).sort(sort).limit(limit).skip(startIndex);
            const totalCount = await SneakerModel.countDocuments(query);
            const hasMore = endIndex < totalCount;

            res.json({
                sneakers,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: hasMore,
                totalCount
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    },

    getCategory: async (req, res) => {
        try {
            const category = req.params.category;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            let query = {
                categories: category
            };

            let sort = {};

            if (req.query.color) {
                const colors = typeof req.query.color === 'string' ? [req.query.color] : req.query.color;
                const colorQueries = colors.map(color => {
                    const regex = new RegExp('\\b' + coresRegex[color].source + '\\b', 'gi');;
                    if (regex) {
                        return {
                            $or: [
                                { "cor": { $regex: regex } },
                                { "sneakerTitle": { $regex: regex } }
                            ]
                        };
                    } else {
                        return null;
                    }
                }).filter(query => query !== null);

                if (colorQueries.length > 0) {
                    query.$or = colorQueries;
                }
            }

            if (req.query.size) {
                const sizes = typeof req.query.size === 'string' ? [req.query.size] : req.query.size;
                query.availableSizes = { $in: sizes };
            }

            if (req.query.store) {
                const stores = typeof req.query.store === 'string' ? [req.query.store] : req.query.store;
                query.store = { $in: stores };
            }

            if (req.query.brand) {
                const brands = typeof req.query.brand === 'string' ? [req.query.brand] : req.query.brand;
                query.brands = { $in: brands };
            }

            if (req.query.minPrice || req.query.maxPrice) {
                const minPrice = parseFloat(req.query.minPrice) || 0;
                const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

                query.currentPrice = {
                    $gte: minPrice,
                    $lte: maxPrice
                };
            }

            if (req.query.orderBy) {
                const orderBy = req.query.orderBy;
                if (orderBy === "price-asc") {
                    sort = { currentPrice: 1 };
                }

                if (orderBy === "price-desc") {
                    sort = { currentPrice: -1 };
                }

                if (orderBy === "date-asc") {
                    sort = { createdAt: 1 };
                }

                if (orderBy === "date-desc") {
                    sort = { createdAt: -1 };
                }
            } else {
                sort = { createdAt: -1 };
            }

            const sneakers = await SneakerModel.find(query).sort(sort).limit(limit).skip(startIndex);
            const totalCount = await SneakerModel.countDocuments(query);
            const hasMore = endIndex < totalCount;

            res.json({
                sneakers,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: hasMore,
                totalCount
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    },

    getSearch: async (req, res) => {
        try {
            const search = req.params.search;

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const regex = new RegExp('\\b' + search + '\\b', 'gi');
            const nameQuery = {
                $or: [
                    { sneakerTitle: regex },
                    { productReference: regex }
                ]
            };

            let query = nameQuery;
            let sort = {};

            if (req.query.color) {
                const colors = typeof req.query.color === 'string' ? [req.query.color] : req.query.color;
                const colorQueries = colors.map(color => {
                    const regex = new RegExp('\\b' + coresRegex[color].source + '\\b', 'gi');
                    return { colors: { $regex: regex } };
                });

                if (colorQueries.length > 0) {
                    query = {
                        $and: [
                            nameQuery,
                            { $or: colorQueries }
                        ]
                    };
                }
            }

            if (req.query.size) {
                const sizes = typeof req.query.size === 'string' ? [req.query.size] : req.query.size;
                query.availableSizes = { $in: sizes };
            }

            if (req.query.store) {
                const stores = typeof req.query.store === 'string' ? [req.query.store] : req.query.store;
                query.store = { $in: stores };
            }

            if (req.query.brand) {
                const brands = typeof req.query.brand === 'string' ? [req.query.brand] : req.query.brand;
                query.brands = { $in: brands };
            }

            if (req.query.category) {
                const categories = typeof req.query.category === 'string' ? [req.query.category] : req.query.category;
                query.categories = { $in: categories };
            }

            if (req.query.minPrice || req.query.maxPrice) {
                const minPrice = parseFloat(req.query.minPrice) || 0;
                const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

                query.currentPrice = {
                    $gte: minPrice,
                    $lte: maxPrice
                };
            }

            if (req.query.orderBy) {
                const orderBy = req.query.orderBy;
                if (orderBy === "price-asc") {
                    sort = { currentPrice: 1 };
                }

                if (orderBy === "price-desc") {
                    sort = { currentPrice: -1 };
                }

                if (orderBy === "date-asc") {
                    sort = { createdAt: 1 };
                }

                if (orderBy === "date-desc") {
                    sort = { createdAt: -1 };
                }
            } else {
                sort = { createdAt: -1 };
            }

            const sneakers = await SneakerModel.find(query).sort(sort).limit(limit).skip(startIndex);

            const uniqueSneakers = [];
            const seenIds = new Set();

            sneakers.forEach(sneaker => {
                if (!seenIds.has(sneaker._id)) {
                    uniqueSneakers.push(sneaker);
                    seenIds.add(sneaker._id);
                }
            });

            const totalCount = await SneakerModel.countDocuments(query);
            const hasMore = endIndex < totalCount;

            res.json({
                sneakers: uniqueSneakers,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: hasMore,
                totalCount
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    }

};

module.exports = sneakerController;
