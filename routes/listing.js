const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middelware.js");
const listingController = require("../controllers/listingController.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(upload.single("image"), validateListing, wrapAsync(listingController.addListing));

router.get("/new", isLoggedIn, listingController.renderNewListingForm);

router.route("/:id")
    .put(isLoggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(listingController.updateListing))
    .get(wrapAsync(listingController.showListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;