const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs=require("ejs");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride=require("method-override");
const listing = require("./models/listings.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main().then(()=>{
    console.log("database connected");
});

app.get("/listing",async (req,res)=>{
    let allListing = await listing.find({});
    res.render("listings/index.ejs",{listing:allListing});
});

app.get("/listing/new",(req,res)=>{
    res.render("listings/newListing.ejs");
});

app.put("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    let result = await listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/listing/${id}`);
});

app.get("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id);
    res.render("listings/listing.ejs",{list:listingData});
});

app.get("/listing/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id);
    res.render("listings/Edit.ejs",{list:listingData});
});

app.delete("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    let deletedData= await listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listing");
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