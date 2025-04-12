const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
// const mongoose = require("mongoose");
const Review = require("../models/reviews.js");
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
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // console.log(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    let res1 = await newReview.save();
    let res2 = await listing.save();
    console.log(res1);
    console.log(res2);
    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete review route

router.delete(
  //the id parameter of in the original link gets only restricted to index.js if we use this way of routing, if we want both files to access all the params, use mergeParams : true in the Router object
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //$pull is a Mongo operator used to remove all occurences of reviewId in reviews array
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
