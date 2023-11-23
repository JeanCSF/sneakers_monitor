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

            res.status(201).json({ response, msg: "Sneaker adicionado com sucesso!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Erro interno do servidor" });
        }
    },
    getAll: async (req, res) => {
        try {
            const store = req.query.storeName;
            const sneakers = await SneakerModel.find({ store });
            res.json(sneakers);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Erro interno do servidor" });
        }
    },
    get: async (req, res) => {
        try {
            const id = req.params.id;
            const store = req.query.storeName;
            const sneaker = await SneakerModel.findOne({ _id: id, store });
            if (!sneaker) {
                res.status(404).json({ msg: "Sneaker não encontrado" });
                return;
            }
            res.json(sneaker);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Erro interno do servidor" });
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const store = req.query.storeName;
            const sneaker = await SneakerModel.findOne({ _id: id, store });
            if (!sneaker) {
                res.status(404).json({ msg: "Sneaker não encontrado" });
                return;
            }
            const deletedSneaker = await SneakerModel.findByIdAndDelete(id);
            res.status(200).json({ deletedSneaker, msg: "Sneaker excluído com sucesso" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Erro interno do servidor" });
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
            const updatedSneaker = await SneakerModel.findByIdAndUpdate(id, sneaker, { new: true });
            if (!updatedSneaker) {
                res.status(404).json({ msg: "Sneaker não encontrado" });
                return;
            }
            res.status(200).json({ updatedSneaker, msg: "Sneaker atualizado com sucesso" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }
};

module.exports = sneakerController;
