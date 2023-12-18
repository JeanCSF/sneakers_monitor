const express = require("express");
const cors = require("cors");
const app = express();
const cron = require("node-cron");

const mainCluster = require("./mainCluster");

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
const timeGapInHours = "0 */3 * * *";

const runScrapingScripts = async () => {
    try {
        await mainCluster();
        console.log('Execução inicial dos scripts concluída com sucesso');
    } catch (error) {
        console.error('Erro na execução inicial dos scripts:', error);
    }
};
runScrapingScripts();

cron.schedule(timeGapInHours, async () => {
    try {
        await Promise.allSettled([runScrapingScripts()]);
        console.log('Script de scraping concluído com sucesso');
    } catch (error) {
        console.error('Erro ao executar o script de scraping:', error);
    }
});