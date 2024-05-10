const sneakerController = require("../controllers/sneakerController");
const router = require("express").Router();
const express = require("express");
const path = require("path");
require("dotenv").config();


router.use(express.static(path.join(__dirname, "../public")));
router.route("/")
    .get((res) => res.sendFile(path.join(__dirname, "../public/index.html")));

router.route("/sneakers")
    .get((req, res) => sneakerController.getAll(req, res));

router.route("/sneaker/:id")
    .get((req, res) => sneakerController.get(req, res));

router.route("/sneaker/similar/:id")
    .get((req, res) => sneakerController.getSimilar(req, res));

router.route("/sneakers/categories")
    .get((req, res) => sneakerController.getAllCategories(req, res));

router.route("/sneakers/category/:category")
    .get((req, res) => sneakerController.getCategory(req, res));

router.route("/sneakers/stores")
    .get((req, res) => sneakerController.getAllStores(req, res));

router.route("/sneakers/store/:store")
    .get((req, res) => sneakerController.getStore(req, res));

router.route("/sneakers/brands")
    .get((req, res) => sneakerController.getAllBrands(req, res));

router.route("/sneakers/brand/:brand")
    .get((req, res) => sneakerController.getBrand(req, res));

module.exports = router;