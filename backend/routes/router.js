const router = require("express").Router();

const sneakersRouter = require("./stores");

router.use("/", sneakersRouter);

module.exports = router;