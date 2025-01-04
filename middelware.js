const Listing = require("./models/listings");
const reviewSchema = require("./models/review.js");
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
            req.flash("error","you need to login first");
            return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl= (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; 
    }
    next();
}

module.exports.isOwned = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.userData._id)){
        req.flash("error","you don't own this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = Listing.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    const { id, reviewId } = req.params;
    let reviewData = await reviewSchema.findById(id);
    if(!reviewData.author._id.equals(res.locals.userData._id)){
        req.flash("error","you don't created this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}