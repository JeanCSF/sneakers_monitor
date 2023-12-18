const mongoose = require("mongoose");

const { Schema, Types } = mongoose;

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
        type: Types.Decimal128,
        required: true
    },
    discountPrice: {
        type: Types.Decimal128,
        required: false
    },
    priceHistory: [
        {
            price: { type: Types.Decimal128, required: true },
            date: { type: Date, default: Date.now }
        }
    ],
    availableSizes: {
        type: [Number],
        required: true
    }
},
    { timestamps: true }
);

const Sneaker = mongoose.model("sneaker", sneakerSchema, "snkrs-magnet");

module.exports = {
    Sneaker,
};