const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const listingController = require("../controllers/listings.js")
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//create and post route combined
router
.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
   upload.array('listing[image]'),
   validateListing,
  wrapAsync(listingController.createListing)
);

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//show, update and delete route combined 
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.array('images'),
    validateListing,
     wrapAsync(listingController.updateListing))
.delete(isLoggedIn,
      isOwner,
      wrapAsync(listingController.destroyListing));

  
  // //edit route
  router.get("/:id/edit", isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

 
  
   module.exports = router;