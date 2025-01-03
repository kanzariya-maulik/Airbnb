const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middelware.js");

router.get("/singup",(req,res)=>{
    res.render("users/singup.ejs");
});

router.post("/singup",wrapAsync(async(req,res)=>{
    try{
    let {username,email,password} = req.body;
    const newUser  = new User({email,username});
    let result = await User.register(newUser,password);
    req.login(result,(err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","Welcome to Airbnb ! ");
    res.redirect("/listing");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/singup");
    }
}));

router.get("/login",async(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),async(req,res)=>{
    req.flash("success","welcome back to Airbnb");
    let redirectUrl = res.locals.redirectUrl || "/listing"; 
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            req.flash("error", "Something went wrong during logout.");
            return next(err);
        }
        req.flash("success", "You logged out!");
        return res.redirect("/listing");
    });
});

module.exports= router;
