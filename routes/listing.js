const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");



const listing = require("../models/listings.js");
const {listingSchema} = require("../Schema.js");
const {isLoggedIn, isOwned,validateListing} = require("../middelware.js");

const listingController = require("../controllers/listingController.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file if it's an image
      } else {
        cb(new Error('Only image files are allowed'), false); // Reject the file if it's not an image
      }
    },
  });

router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single("image"),validateListing,wrapAsync(listingController.addListing));

router.get("/new",isLoggedIn,listingController.renderNewListingForm);


router.route("/:id")
.put(isLoggedIn,isOwned,upload.single("image"),validateListing,wrapAsync(listingController.updateListing))
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwned,wrapAsync(listingController.destroyListing));

router.get("/:id/edit",isLoggedIn,isOwned,wrapAsync(listingController.editListing));

module.exports =  router;