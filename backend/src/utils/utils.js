const { Sneaker: SneakerModel } = require("../../models/Sneaker");
const ExcelJS = require('exceljs');
const path = require('path');

const onTest = true;
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Test Data');
worksheet.addRow(['Store', 'Product Reference', 'Sneaker Name', 'Current Price', 'Discount Price', 'Available Sizes', 'Date', 'Link', 'Image']);

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

async function updateOrCreateSneaker(sneakerObj, term) {
    const { productReference, store, sneakerName, availableSizes } = sneakerObj;
    if (sneakerName.toLowerCase().includes(term.toLowerCase()) && availableSizes.length !== 0) {
        try {
            if (onTest) {
                worksheet.addRow([store, productReference, sneakerName, sneakerObj.currentPrice, sneakerObj.discountPrice, sneakerObj.availableSizes.join(', '), new Date().toLocaleString(), sneakerObj.srcLink, sneakerObj.img]);
                const filePath = path.join(__dirname, 'test_data.xlsx');
                await workbook.xlsx.writeFile(filePath);
                console.log(`Dados salvos em ${filePath}`);
            } else {
                const existingSneaker = await SneakerModel.findOne({ store, productReference });
                if (existingSneaker) {
                    if (existingSneaker.currentPrice !== sneakerObj.currentPrice || !arraysEqual(existingSneaker.availableSizes, sneakerObj.availableSizes)) {
                        existingSneaker.currentPrice = sneakerObj.currentPrice;
                        existingSneaker.priceHistory.push({ price: sneakerObj.currentPrice, date: new Date() });
                        existingSneaker.availableSizes = sneakerObj.availableSizes;
                        await existingSneaker.save();
                        console.log('Sneaker atualizado no banco de dados.');
                    } else {
                        console.log('Sneaker já existe no banco de dados e o preço não mudou.');
                    }
                } else {
                    await SneakerModel.create(sneakerObj);
                    console.log('Sneaker adicionado ao banco de dados.');
                }
            }
        } catch (error) {
            console.error('Erro ao chamar o endpoint da API:', error);
        }
    } else {
        console.log('O modelo não corresponde à pesquisa. Não será salvo no banco de dados.');
    }
}

function createSearchUrl(url, term) {
    if (url.includes('correderua')) {
        return `${url}?q=${encodeURIComponent(term)}&pagina=1`;
    } else if (url.includes('gdlp')) {
        return `${url}catalogsearch/result/?q=${term.replace(/\s+/g, '+').toLowerCase()}`;
    } else if (url.includes('artwalk')) {
        return `${url}${term.replace(/\s+/g, '-').toLowerCase()}?O=OrderByPriceASC&PS=24`;
    } else if (url.includes('lojavirus')) {
        return `${url}busca?busca=${term.replace(/\s+/g, '-').toLowerCase()}`;
    } else {
        console.error('URL não reconhecida:', url);
        return url;
    }
}


module.exports = { arraysEqual, updateOrCreateSneaker, createSearchUrl };