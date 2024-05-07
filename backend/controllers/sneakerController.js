const { Sneaker: SneakerModel } = require("../models/Sneaker");


const sneakerController = {
    getAll: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            let query = {};
            let sort = {};

            if (req.query.search) {
                const regex = new RegExp(req.query.search, 'i');
                query.sneakerTitle = regex;
            }

            if (req.query.color) {
                const colors = typeof req.query.color === 'string' ? [req.query.color] : req.query.color;
                query.colors = { $in: colors };
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
                query.colors = { $in: colors };
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
                query.colors = { $in: colors };
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
                query.colors = { $in: colors };
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
    }

};

module.exports = sneakerController;
