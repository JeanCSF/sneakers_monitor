const mongoose = require("mongoose");

const { Schema } = mongoose;

const sneakerSchema = new Schema({
    srcLink: {
        type: String,
        required: true
    },
    productReference: {
        type: String,
        required: true
    },
    store: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    sneakerName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    availableSizes: {
        type: [String],
        required: true
    }
},
    { timestamps: true }
);

const Sneaker = mongoose.model("Sneaker", sneakerSchema);

module.exports = {
    Sneaker,
    sneakerSchema,
};