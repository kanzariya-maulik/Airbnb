const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js"); // Correct model import
const Listing = require("../models/listings.js"); // Import listing model
const { reviewSchema } = require("../Schema.js"); // Import review schema
const {validateReview, isLoggedIn} = require("../middelware.js");

const reviewController = require("../controllers/reviewController.js");

router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

router.delete(
    "/:reviewId",
    isLoggedIn,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
