const router = require("express").Router();

const sneakerController = require("../controllers/sneakerController");

router
    .route("/sneakers")
    .post((req, res) => sneakerController.create(req, res));

router
    .route("/sneakers")
    .get((req, res) => sneakerController.getAll(req, res));

router
    .route("/sneakers/:id")
    .get((req, res) => sneakerController.get(req, res));

router
    .route("/sneakers/:id")
    .delete((req, res) => sneakerController.delete(req, res));

router
    .route("/sneakers/:id")
    .put((req, res) => sneakerController.update(req, res));
module.exports = router;