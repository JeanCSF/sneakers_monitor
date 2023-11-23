const router = require("express").Router();

const sneakerController = require("../controllers/sneakerController");

router.post("/stores/:storeName/sneakers", (req, res) => sneakerController.create(req, res));

router.get("/stores/:storeName/sneakers", (req, res) => sneakerController.getAll(req, res));

router.get("/stores/:storeName/sneakers/:id", (req, res) => sneakerController.get(req, res));

router.delete("/stores/:storeName/sneakers/:id", (req, res) => sneakerController.delete(req, res));

router.put("/stores/:storeName/sneakers/:id", (req, res) => sneakerController.update(req, res));

module.exports = router;
