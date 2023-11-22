const { Sneaker: SneakerModel } = require("../models/Sneaker");

const sneakerController = {
    create: async (req, res) => {
        try {
            const sneaker = {
                srcLink: req.body.srcLink,
                productReference: req.body.productReference,
                store: req.body.store,
                img: req.body.img,
                sneakerName: req.body.sneakerName,
                price: req.body.price,
                availableSizes: req.body.availableSizes
            };

            const response = await SneakerModel.create(sneaker);

            res.status(201).json({ response, msg: "Sneaker adicionado com sucesso!" })
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req, res) => {
        try {
            const sneakers = await SneakerModel.find();
            res.json(sneakers);
        } catch (error) {
            console.log(error)
        }
    },
    get: async (req, res) => {
        try {
            const id = req.params.id;
            const sneaker = await SneakerModel.findById(id);
            if (!sneaker) {
                res.status(404).json({ msg: "Sneaker não encontrado" });
                return;
            }
            res.json(sneaker);
        } catch (error) {
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const sneaker = await SneakerModel.findById(id);
            if (!sneaker) {
                res.status(404).json({ msg: "Sneaker não encontrado" });
                return;
            }
            const deletedSneaker = await SneakerModel.findByIdAndDelete(id);
            res.status(200).json({ deletedSneaker, msg: "Sneaker excluído com sucesso" })
        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const sneaker = {
                srcLink: req.body.srcLink,
                productReference: req.body.productReference,
                store: req.body.store,
                img: req.body.img,
                sneakerName: req.body.sneakerName,
                price: req.body.price,
                availableSizes: req.body.availableSizes
            };
            const updatedSneaker = await SneakerModel.findByIdAndUpdate(id, sneaker);
            if (!updatedSneaker) {
                res.status(404).json({ msg: "Sneaker não encontrado" });
                return;
            }
            res.status(200).json({ sneaker, msg: "Sneaker atualizado com sucesso" })
        } catch (error) {
            console.log(error);
        }
    }
};

module.exports = sneakerController;