const mongoose = require("mongoose");
const review = require("./review.js");
const User = require("./user.js");

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://global.discourse-cdn.com/openai1/original/4X/f/1/d/f1d50f39bd42e2f372a50931b4151f5afcfa9e46.png",
        set: (v) => v === '' ? "https://global.discourse-cdn.com/openai1/original/4X/f/1/d/f1d50f39bd42e2f372a50931b4151f5afcfa9e46.png" : v,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review", 
        },
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", ListingSchema); 
module.exports = Listing;
