const mongoose = require("mongoose");
const data = require("./data.js");
const listing = require("../models/listings.js");
const review = require("../models/review.js");
const logger = require("../utils/logger.js");

async function main() {
    mongoose.connect("mongodb+srv://kanzariyamaulik9:GSBOOLJOaKK8F22a@cluster0.sx4p4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;");
}

main().then(()=>{
    logger.info("database connected");
});

const initDB = async () => {
    await listing.deleteMany({});
    await review.deleteMany({});
    data.data = data.data.map((obj)=>({...obj,owner:"677ec8d6e415477c348a9ef9"}));
    await listing.insertMany(data.data);      
}
initDB();