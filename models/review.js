const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const model = mongoose.model("Review", reviewSchema);
module.exports = model;
