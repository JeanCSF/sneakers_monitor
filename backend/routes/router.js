const router = require("express").Router();

const sneakersRouter = require("./sneakers");

router.use("/", sneakersRouter);

module.exports = router;