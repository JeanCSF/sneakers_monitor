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
const timeGapInHours = "0 */1 * * *";

const artwalk = async () => {
    try {
        await scrapingArtwalk();
        console.log('Scraping Artwalk concluído com sucesso');
    } catch (error) {
        console.error('Erro ao executar o scraping da Artwalk:', error);
    }
};

const gdlp = async () => {
    try {
        await scrapingGDLP();
        console.log('Scraping GDLP concluído com sucesso');
    } catch (error) {
        console.error('Erro ao executar o scraping da GDLP:', error);
    }
};

const lojaVirus = async () => {
    try {
        await scrapingLojaVirus();
        console.log('Scraping LojaVirus concluído com sucesso');
    } catch (error) {
        console.error('Erro ao executar o scraping da LojaVirus:', error);
    }
};

const yourId = async () => {
    try {
        await scrapingYouID();
        console.log('Scraping YouID concluído com sucesso');
    } catch (error) {
        console.error('Erro ao executar o scraping da YouID:', error);
    }
};

const runScrapingScripts = async () => {
    try {
        await lojaVirus();
        await yourId();
        await artwalk();
        await gdlp();
        console.log('Execução inicial dos scripts concluída com sucesso');
    } catch (error) {
        console.error('Erro na execução inicial dos scripts:', error);
    }
};

runScrapingScripts();

cron.schedule(timeGapInHours, async () => {
    console.log('Executando scripts');
    try {
        await Promise.allSettled([runScrapingScripts()]);
        console.log('Script de scraping concluído com sucesso');
    } catch (error) {
        console.error('Erro ao executar o script de scraping:', error);
    }
});