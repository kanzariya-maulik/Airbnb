const mongoose = require("mongoose");
const User = require("./user");

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
    author:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    }
});

const model = mongoose.model("Review", reviewSchema);
module.exports = model;
