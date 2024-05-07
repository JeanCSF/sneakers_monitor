const mongoose = require("mongoose");

const { Schema } = mongoose;

const sneakerSchema = new Schema({
    srcLink: {
        type: String,
        required: true
    },
    productReference: {
        type: String,
        required: false
    },
    store: {
        type: String,
        required: true
    },
    brands: {
        type: [String],
        required: true
    },
    img: {
        type: String,
        required: true
    },
    sneakerTitle: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
        required: false
    },
    colors: {
        type: [String],
        required: false
    },
    currentPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: false
    },
    priceHistory: [
        {
            price: { type: Number, required: true },
            date: { type: Date, default: Date.now }
        }
    ],
    availableSizes: {
        type: [Number],
        required: true
    },
    codeFromStore: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

const Sneaker = mongoose.model("Sneaker", sneakerSchema, "sneakers");

module.exports = {
    Sneaker,
};