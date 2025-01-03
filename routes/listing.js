const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');

const listing = require("../models/listings.js");
const {listingSchema} = require("../Schema.js");
const {isLoggedIn} = require("../middelware.js");

let validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


router.get("/",wrapAsync(async (req,res)=>{
    let allListing = await listing.find({});
    res.render("listings/index.ejs",{listing:allListing});
}));

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/newListing.ejs");
});

router.put("/:id",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let result = await listing.findByIdAndUpdate(id,{...req.body});
    req.flash("success","Listing Updated Succesfully!");
    res.redirect(`/listing/${id}`);
}));

router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id).populate("reviews");
    if (!listingData) {
        req.flash("error", "Listing not Exist!");
        return res.redirect("/listing");
    }    
    res.render("listings/listing.ejs",{list:listingData});
}));

router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id);
    if (!listingData) {
        req.flash("error", "Listing not Exist!");
        return res.redirect("/listing");
    }       
    res.render("listings/Edit.ejs",{list:listingData});
}));

router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedData= await listing.findByIdAndDelete(id);
    console.log(deletedData);
    req.flash("success","Listing Deleted Succesfully!");
    res.redirect("/listing");
}));

router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    let {title,description,image,price,location,country}=req.body;
    let newListing = new listing({title:title,description,image,price,location,country});
    const result =await newListing.save();
    req.flash("success","New Listing created Succesfully!");
    res.redirect("/listing");
}));

module.exports =  router;
