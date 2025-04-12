const Listing = require('../models/listing');
const ExpressError = require("../utils/ExpressError.js");
const {Listingschema, reviewSchema} = require('../schema.js');
const Review = require('../models/reviews.js');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in");
    return res.redirect("/login");
  } 
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You do not have permissi");
    res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.ValidateListings = (req, res, next) => {
  let result = Listingschema.validate(req.body);
  if (result.error) {
    let error = result.error.details[0].message;
    console.log(error);
    throw new ExpressError(300, error);
  } else {
    next();
  }
};

module.exports.ValidateReview = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    let error = result.error.details[0].message;
    console.log(error);
    throw new ExpressError(300, error);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next)=>{
  let {id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error", "Not authorized to delete");
    return res.redirect(`/listings/${id}`)
  }
  next();
}