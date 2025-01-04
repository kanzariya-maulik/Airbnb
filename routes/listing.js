const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const listing = require("../models/listings.js");
const {listingSchema} = require("../Schema.js");
const {isLoggedIn, isOwned,validateListing} = require("../middelware.js");


router.get("/",wrapAsync(async (req,res)=>{
    let allListing = await listing.find({});
    res.render("listings/index.ejs",{listing:allListing});
}));

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/newListing.ejs");
});

router.put("/:id",isLoggedIn,isOwned,validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let result = await listing.findByIdAndUpdate(id,{...req.body});
    req.flash("success","Listing Updated Succesfully!");
    res.redirect(`/listing/${id}`);
}));

router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id) .populate({
        path: "reviews",
        populate: { path: "author" }
    })
    .populate("owner");
    if (!listingData) {
        req.flash("error", "Listing not Exist!");
        return res.redirect("/listing");
    }    
    res.render("listings/listing.ejs",{list:listingData});
}));

router.get("/:id/edit",isLoggedIn,isOwned,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id);
    if (!listingData) {
        req.flash("error", "Listing not Exist!");
        return res.redirect("/listing");
    }       
    res.render("listings/Edit.ejs",{list:listingData});
}));

router.delete("/:id",isLoggedIn,isOwned,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedData= await listing.findByIdAndDelete(id);
    console.log(deletedData);
    req.flash("success","Listing Deleted Succesfully!");
    res.redirect("/listing");
}));

router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    let {title,description,image,price,location,country}=req.body;
    let newListing = new listing({title:title,description,image,price,location,country});
    newListing.owner = req.user._id;
    const result =await newListing.save();
    req.flash("success","New Listing created Succesfully!");
    res.redirect("/listing");
}));

module.exports =  router;