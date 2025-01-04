const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const listing = require("../models/listings.js");
const {listingSchema} = require("../Schema.js");
const {isLoggedIn, isOwned,validateListing} = require("../middelware.js");

const listingController = require("../controllers/listingController.js")

router.get("/",wrapAsync(listingController.index));

router.get("/new",isLoggedIn,listingController.renderNewListingForm);

router.put("/:id",isLoggedIn,isOwned,validateListing,wrapAsync(listingController.updateListing));

router.get("/:id",wrapAsync(listingController.showListing));

router.get("/:id/edit",isLoggedIn,isOwned,wrapAsync(listingController.editListing));

router.delete("/:id",isLoggedIn,isOwned,wrapAsync(listingController.destroyListing));

router.post("/",validateListing,wrapAsync(listingController.addListing));

module.exports =  router;