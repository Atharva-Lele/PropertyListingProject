const { default_type } = require("mime");
const mongoose = require("mongoose");
const { type } = require("os");
const reviewSchema = require("./reviews");

let listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-…",
      set: (v) => (v === "" ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-…" : v),
    },
  },
  description: String,
  location: String,
  price: Number,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Review",
    },
  ],
  // owner:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User"

  // }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await reviewSchema.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
