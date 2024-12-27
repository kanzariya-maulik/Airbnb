//packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs=require("ejs");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride=require("method-override");

//error utilities
const { error } = require("console");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require("./Schema.js");
const {reviewSchema} = require("./Schema.js");


//setup
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

//db connection and models
const listing = require("./models/listings.js");
let review = require("./models/review.js");
const { wrap } = require("module");
async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main().then(()=>{
    console.log("database connected");
});


let validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

let validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

app.get("/listing",wrapAsync(async (req,res)=>{
    let allListing = await listing.find({});
    res.render("listings/index.ejs",{listing:allListing});
}));

app.get("/listing/new",(req,res)=>{
    res.render("listings/newListing.ejs");
});

app.put("/listing/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let result = await listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/listing/${id}`);
}));

app.get("/listing/:id",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id).populate("reviews");
    res.render("listings/listing.ejs",{list:listingData});
}));

app.get("/listing/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id);
    res.render("listings/Edit.ejs",{list:listingData});
}));

app.delete("/listing/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedData= await listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listing");
}));

app.post("/listing",validateListing,wrapAsync(async (req,res,next)=>{
    let {title,description,image,price,location,country}=req.body;
    console.log(title,description,image,price,location,country);
    let newListing = new listing({title:title,description,image,price,location,country});
    const result =await newListing.save();
    res.redirect("/listing");
}));

//review 

app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res,next)=>{
        let {id} = req.params;
        let list = await listing.findById(id);
        console.log(req.body.review);
        let reviewData = new review(req.body.review);

        list.reviews.push(reviewData);

        await reviewData.save();
        await list.save();

        res.redirect(`/listing/${id}`);
}));

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
        let {id,reviewId} = req.params;

        await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

        await review.findByIdAndDelete(reviewId);

        res.redirect(`/listing/${id}`);
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

// app.use((err,req,res,next)=>{
//     let {statusCode = 500,message = "Something went Wrong"} = err;
//     res.status(statusCode).render("error.ejs",{err});
// });

app.listen(8080,(req,res)=>{
    console.log("port is listning on 8080");
});