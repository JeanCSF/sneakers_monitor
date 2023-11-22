const express = require("express");
const cors = require("cors");
const app = express();
const cron = require("node-cron");
const scrapingArtwalk = require('./src/stores/artwalk');
const scrapingGDLP = require("./src/stores/gdlp");

app.use(cors());

app.use(express.json());

const conn = require("./db/conn");
conn();

const routes = require("./routes/router");

app.use("/api", routes);

app.listen(process.env.PORT || 3000, () => {
    console.log('servidor ok');
});

cron.schedule('0 */6 * * *', async () => {
    console.log('Executando scripts');
    try {
        await scrapingArtwalk();
        await scrapingGDLP();
        console.log('Script de scraping concluído com sucesso');
    } catch (error) {
        console.error('Erro ao executar o script de scraping:', error);
    }
});