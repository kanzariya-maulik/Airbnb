const mongoose = require("mongoose");
const data = require("./data.js");
const listing = require("../models/listings.js");
const review = require("../models/review.js");

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main().then(()=>{
    console.log("database connected");
});

const initDB = async () => {
    await listing.deleteMany({});
    await review.deleteMany({});
    data.data = data.data.map((obj)=>({...obj,owner:"677828af220bb431b9877c36"}));
    await listing.insertMany(data.data);      
}
initDB();