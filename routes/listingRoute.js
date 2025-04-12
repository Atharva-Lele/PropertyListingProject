const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const {
  isLoggedIn,
  isOwner,
  ValidateListings,
} = require("../utils/middlewares.js");
const methodOverride = require("method-override");

const { Listingschema, reviewSchema } = require("../schema.js");

router.get("/", async (req, res, next) => {
  try {
    console.log(res.locals.success + res.locals.error);
    Listing.find({}).then((result) => {
      res.render("allListings.ejs", {
        result,
        // success: req.flash("success"),
        // error: req.flash("error")
      });
    });
  } catch (err) {
    console.log(err);
    next();
  }
});

//new listing serve form
router.get("/newUser", isLoggedIn, (req, res) => {
  // Static routes should always come before dynamic ones, express expects newUser to be an id if we write that route after /listings/:id
  res.render("newListing.ejs");
});
//new listing
router.post(
  "/",
  ValidateListings,
  wrapAsync(async (req, res, next) => {
    let bodyObj = req.body;
    const newListing = new Listing(bodyObj);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
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
  isLoggedIn,
  isOwner,
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
  "/:id",
  isLoggedIn,
  isOwner,
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

    const result = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: 'author',
        },
      })
      .populate("owner");

    if (!result) {
      req.flash("error", "Listing not found");
      res.redirect("/listings");
      // return next(new ExpressError(404, "Listing Not Found"));
    } else {
      console.log(result);
      res.render("indiPlace.ejs", { result });
    }
  })
);

module.exports = router;
