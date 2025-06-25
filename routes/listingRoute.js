const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage })

const listingsController = require("../controller/listingsController.js");
const {
  isLoggedIn,
  isOwner,
  ValidateListings,
} = require("../utils/middlewares.js");
const methodOverride = require("method-override");

const { Listingschema, reviewSchema } = require("../schema.js");

router
  .route("/")
  .get(listingsController.GetAllListings)
  .post(isLoggedIn,
  upload.single('image[url]'),
  wrapAsync(listingsController.NewListingPost),
  ValidateListings,
  )
  // .post(upload.single('image[url]'), (req, res) =>{
  //   res.send(req.file);
  // })

//new listing serve form
router.get("/newUser", isLoggedIn, listingsController.ServeNewListing);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.ServeEditForm)
);

router
  .route("/:id")
  .get(wrapAsync(listingsController.GetIndiListing))
  .post( isLoggedIn,
  isOwner,
  upload.single('image[url]'),
  ValidateListings,
  wrapAsync(listingsController.EditFormPost))
  .delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.DeleteListing))


module.exports = router;
