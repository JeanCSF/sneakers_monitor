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
    currentPrice: {
        type: String,
        required: true
    },
    discountPrice: {
        type: String,
        required: false
    },
    priceHistory: [
        {
            price: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ],
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