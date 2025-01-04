const User = require("../models/user");

module.exports.renderSingup = (req,res)=>{
    res.render("users/singup.ejs");
}

module.exports.singup = async(req,res)=>{
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
}

module.exports.renderLogin = async(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","welcome back to Airbnb");
    let redirectUrl = res.locals.redirectUrl || "/listing"; 
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            req.flash("error", "Something went wrong during logout.");
            return next(err);
        }
        req.flash("success", "You logged out!");
        return res.redirect("/listing");
    });
}