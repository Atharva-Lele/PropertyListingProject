const Listing = require('../models/listing');
const Review = require('../models/reviews');

module.exports.createReview = async (req, res) => {
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
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //$pull is a Mongo operator used to remove all occurences of reviewId in reviews array
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}