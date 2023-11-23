const express = require("express");
const cors = require("cors");
const app = express();
const cron = require("node-cron");

const scrapingArtwalk = require('./src/stores/artwalk');
const scrapingGDLP = require("./src/stores/gdlp");
const scrapingLojaVirus = require("./src/stores/lojavirus");
const scrapingYouID = require("./src/stores/yourid");

app.use(cors());

app.use(express.json());

const conn = require("./db/conn");
conn();

const routes = require("./routes/router");

app.use("/api", routes);

app.listen(process.env.PORT || 3000, () => {
    console.log('servidor ok');
});

const timeGapInMinutes = "*/2 * * * *";
const timeGapInHours = "0 */6 * * *";

cron.schedule(timeGapInMinutes, async () => {
    console.log('Executando scripts');
    try {
        await scrapingArtwalk();
        await scrapingGDLP();
        await scrapingLojaVirus();
        await scrapingYouID();
        console.log('Script de scraping concluído com sucesso');
    } catch (error) {
        console.error('Erro ao executar o script de scraping:', error);
    }
});