//packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride=require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

//error utilities
const ExpressError = require('./utils/ExpressError.js');

//setup
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

//db connection and models
const { wrap } = require("module");
async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main().then(()=>{
    console.log("database connected");
});

const sessionOption={
    secret:"session-secret",
    resave:false,
    saveUninitialized:true,
    cookies:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//user router
const listings = require("./routes/listing.js");
app.use("/listing",listings);

//review 
const reviews = require("./routes/review.js");
app.use("/listing/:id/reviews",reviews);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080,(req,res)=>{
    console.log("port is listning on 8080");
});