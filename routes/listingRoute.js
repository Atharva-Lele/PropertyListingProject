const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const isLoggedIn = require('../utils/middlewares.js');

const { Listingschema, reviewSchema } = require("../schema.js");

const ValidateListings = (req, res, next) => {
  let result = Listingschema.validate(req.body);
  if (result.error) {
    let error = result.error.details[0].message;
    console.log(error);
    throw new ExpressError(300, error);
  } else {
    next();
  }
};

router.get(
  "/",
  async (req, res, next) => {
    try {
      console.log(res.locals.success + res.locals.error);
      Listing.find({}).then((result) => {
        res.render("allListings.ejs", { result,
          // success: req.flash("success"),
          // error: req.flash("error")
        });
      });
    } catch (err) {
      console.log(err);
      next();
    }
  }
);

//new listing serve form
router.get("/newUser", isLoggedIn, (req, res) => {
  // Static routes should always come before dynamic ones, express expects newUser to be an id if we write that route after /listings/:id
  res.render("newListing.ejs");
});

router.post(
  "/",
  ValidateListings,
  wrapAsync(async (req, res, next) => {
    let bodyObj = req.body;
    const newListing = new Listing(bodyObj);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/");
  })
);

router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    Listing.findById(id).then((result) => {
      res.render("editform.ejs", { result });
    });
  })
);

//edit form receive route
router.post(
  "/:id",
  ValidateListings,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editbody = req.body;
    Listing.findByIdAndUpdate(id, editbody).then(() => {
      req.flash("success", "Listing updated!");
      res.redirect(`/listings/${id}`);
    });
    console.log(editbody);
  })
);

//delete route
router.delete(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedObj = await Listing.findByIdAndDelete(id);
    console.log(deletedObj);
    req.flash("success", "Listing deleted!");
    res.redirect("/");
  })
);

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // Validate if the ID is a valid ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return next(new ExpressError(400, "Invalid Listing ID"));
    // }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid Listing Id");
      res.redirect("/listings");
    }

    const result = await Listing.findById(id).populate("reviews");

    if (!result) {
      req.flash("error", "Listing not found");
      res.redirect("/listings");
      // return next(new ExpressError(404, "Listing Not Found"));
    } else {
      res.render("indiPlace.ejs", { result });
    }
  })
);

module.exports = router;
