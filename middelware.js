const Listing = require("./models/listings");
const Review = require("./models/review.js");
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You need to login first");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listing");
        }
        
        if (!listing.owner._id.equals(res.locals.userData._id)) {
            req.flash("error", "You don't own this listing");
            return res.redirect(`/listing/${id}`);
        }
        next();
    } catch (error) {
        req.flash("error", "Something went wrong");
        res.redirect("/listing");
    }
};

module.exports.validateListing = (req, res, next) => {
    const { error } = Listing.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = Review.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        
        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listing/${id}`);
        }
        
        if (!review.author._id.equals(res.locals.userData._id)) {
            req.flash("error", "You didn't create this review");
            return res.redirect(`/listing/${id}`);
        }
        next();
    } catch (error) {
        req.flash("error", "Something went wrong");
        res.redirect(`/listing/${id}`);
    }
};