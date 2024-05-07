require("dotenv").config();
const mongoose = require("mongoose");

async function main() {
    const DB_USER = process.env.DB_USER;
    const DB_PASSWORD = process.env.DB_PASSWORD;
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.k1j2s6l.mongodb.net/?retryWrites=true&w=majority`,
            {
                serverSelectionTimeoutMS: 5000,
                dbName: 'snkrs-magnet',
            });

        console.log('banco ok');
    } catch (error) {
        console.log(`Erro: ${error}`)
    }
}

module.exports = main;