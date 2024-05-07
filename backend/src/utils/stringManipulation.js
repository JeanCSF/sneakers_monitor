function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function removeDots(str) {
    return str.replace(/\./g, "");
}

const lastString = string => string.match(/\w+$/)[0];
const last2Strings = string => string.split(" ").slice(-1).join("");

module.exports = {
    removeAccents,
    lastString,
    last2Strings,
    removeDots
}