const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs=require("ejs");
const path = require("path");
const listing = require("./models/listings.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main().then(()=>{
    console.log("database connected");
});

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new listing({
//         title:"new Title",
//         description:"New Home for Your Family",
//         image:"",
//         price:1200,
//         location:"goa",
//         country:"India"
//     });
//     const result =await sampleListing.save();
//     console.log(result);
// });

app.get("/listing",async (req,res)=>{
    let allListing = await listing.find({});
    res.render("index.ejs",{listing:allListing});
});

app.get("/listing/new",(req,res)=>{
    res.render("newListing.ejs");
});

app.get("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id);
    res.render("listing.ejs",{list:listingData});
});

app.post("/listing",async (req,res)=>{
    let {title,description,image,price,location,country}=req.body;
    console.log(title,description,image,price,location,country);
    let newListing = new listing({title:title,description,image,price,location,country});
    const result =await newListing.save();
    res.redirect("/listing");
});

app.listen(8080,(req,res)=>{
    console.log("port is listning on 8080");
});