const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
// const mongoose = require("mongoose");
const Review = require("../models/reviews.js");
const reviewController = require("../controller/reviewController.js");
const { Listingschema, reviewSchema } = require("../schema.js");
const {
  isLoggedIn,
  ValidateReview,
  isAuthor,
} = require("../utils/middlewares.js");

router.get("/:reviewId", (req, res,next)=>{
  let {id, reviewId} = req.params;
  res.redirect(`/listings/${id}`);
})
//review post route
router.post(
  "/",
  isLoggedIn,
  ValidateReview,
  wrapAsync(reviewController.createReview)
);

//Delete review route

router.delete(
  //the id parameter of in the original link gets only restricted to index.js if we use this way of routing, if we want both files to access all the params, use mergeParams : true in the Router object
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
