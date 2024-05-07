const express = require("express");
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../public/swagger.json');

const options = {
    customCssUrl: ['/style.css', "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css"],
    customJs: ['/custom.js', 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.min.js'],
    customSiteTitle: 'Snkr Magnet API - Documentação',
    customfavIcon: '/favicon.ico',
};


const sneakersRouter = require("./sneakers");
router.use("/", sneakersRouter);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
module.exports = router;