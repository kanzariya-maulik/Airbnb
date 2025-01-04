const Listing = require("../models/listings");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id); 

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    console.log(req.body.review);
    const reviewData = new Review(req.body.review);
    reviewData.author = req.user._id;
    listing.reviews.push(reviewData);

    await reviewData.save();
    await listing.save();

    
req.flash("success","we got your Review !");

    res.redirect(`/listing/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    
req.flash("success","Reveiw removed!");
    res.redirect(`/listing/${id}`);
}