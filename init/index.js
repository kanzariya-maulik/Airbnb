const mongoose = require("mongoose");
const data = require("./data.js");
const listing = require("../models/listings.js");

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main().then(()=>{
    console.log("database connected");
});

const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(data.data);      
}
initDB();