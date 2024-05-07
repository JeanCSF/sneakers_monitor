require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cron = require("node-cron");

const mainCluster = require("./mainCluster");

app.use(cors());

app.use(express.json());

const conn = require("./db/conn");
process.env.ENVIRONMENT === "prod" && conn();

const routes = require("./routes/router");

app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

const timeGapInHours = "0 */6 * * *";

const runScrapingScripts = async () => {
    try {
        await mainCluster();
        console.log('Execução inicial dos scripts concluída com sucesso');
    } catch (error) {
        console.error('Erro na execução inicial dos scripts:', error);
    }
};

runScrapingScripts();
if (process.env.ENVIRONMENT === "dev") {

    cron.schedule(timeGapInHours, async () => {
        try {
            runScrapingScripts();
            console.log('Script de scraping concluído com sucesso');
        } catch (error) {
            console.error('Erro ao executar o script de scraping:', error);
        }
    });
}

