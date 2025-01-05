const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const listing = require("../models/listings.js");
const {listingSchema} = require("../Schema.js");
const {isLoggedIn, isOwned,validateListing} = require("../middelware.js");

const listingController = require("../controllers/listingController.js")

router.route("/")
.get(wrapAsync(listingController.index))
.post(validateListing,wrapAsync(listingController.addListing));

router.get("/new",isLoggedIn,listingController.renderNewListingForm);

router.route("/:id")
.put(isLoggedIn,isOwned,validateListing,wrapAsync(listingController.updateListing))
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwned,wrapAsync(listingController.destroyListing));

router.get("/:id/edit",isLoggedIn,isOwned,wrapAsync(listingController.editListing));


module.exports =  router;