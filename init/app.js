const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let sample = require('./data.js');

let app = express();

main()
  .then(() => {
    console.log("db connected");
  })
  .catch((e) => console.log(e));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

let initDb = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(sample.data);
}

initDb();