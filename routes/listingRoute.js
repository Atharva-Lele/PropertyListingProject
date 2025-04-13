const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const flash = require("connect-flash");

const listingsController = require("../controller/listingsController.js");
const {
  isLoggedIn,
  isOwner,
  ValidateListings,
} = require("../utils/middlewares.js");
const methodOverride = require("method-override");

const { Listingschema, reviewSchema } = require("../schema.js");

//Home page- All listings
router.get("/", listingsController.GetAllListings);

//new listing serve form
router.get("/newUser", isLoggedIn, listingsController.ServeNewListing);

//new listing
router.post(
  "/",
  ValidateListings,
  wrapAsync(listingsController.NewListingPost)
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.ServeEditForm)
);

//edit form receive route
router.post(
  "/:id",
  isLoggedIn,
  isOwner,
  ValidateListings,
  wrapAsync(listingsController.EditFormPost)
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.DeleteListing)
);

//show individual listing route
router.get("/:id", wrapAsync(listingsController.GetIndiListing));

module.exports = router;
