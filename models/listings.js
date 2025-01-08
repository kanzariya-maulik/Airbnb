const mongoose = require("mongoose");
const review = require("./review.js");
const User = require("./user.js");
const { required } = require("joi");

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename:String,
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
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number], 
        },
    },
    category:{
        type:String,
        enum:["Rooms","Iconic city","Mountain","Pool","Camping","Farms","Artics","Nature","Urban","Beaches","Luxary"],
    }
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", ListingSchema); 
module.exports = Listing;
