const Listing = require('../models/listing');
const mongoose = require("mongoose");


module.exports.GetAllListings = async (req, res, next) => {
  try {
    console.log(res.locals.success + res.locals.error);
    Listing.find({}).then((result) => {
      res.render("allListings.ejs", { result });
    });
  } catch (err) {
    console.log(err);
    next();
  }
}

module.exports.GetIndiListing = async (req, res) => {
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
          path: "author",
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
}

module.exports.ServeNewListing = (req, res) => {
    // Static routes should always come before dynamic ones, express expects newUser to be an id if we write that route after /listings/:id
    res.render("newListing.ejs");
}

module.exports.NewListingPost = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    let bodyObj = req.body;
    const newListing = new Listing(bodyObj);
    newListing.owner = req.user._id;
    newListing.image = {filename, url};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/");
}

module.exports.ServeEditForm = async (req, res, next) => {
    let { id } = req.params;
    Listing.findById(id).then((result) => {
      let originalImageUrl = result.image.url;
      originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fill,w_200,h_200");
      result = {...result, newUrl : originalImageUrl};
      res.render("editform.ejs", { result });
    });
}

module.exports.EditFormPost = async (req, res) => {
    let { id } = req.params;
    if(req.file){
      let url = req.file.path;
      let filename = req.file.filename;
      let editbody = req.body;
      editbody.image = {filename, url};
      Listing.findByIdAndUpdate(id, editbody).then(() => {
      req.flash("success", "Listing updated!");
      res.redirect(`/listings/${id}`);
    });
    }else{
      let editbody = req.body;
      Listing.findByIdAndUpdate(id, editbody).then(() => {
      req.flash("success", "Listing updated!");
      res.redirect(`/listings/${id}`);
    });

    }  
}

module.exports.DeleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedObj = await Listing.findByIdAndDelete(id);
    console.log(deletedObj);
    req.flash("success", "Listing deleted!");
    res.redirect("/");
}