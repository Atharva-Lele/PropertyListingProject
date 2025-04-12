const { ref } = require('joi');
const mongoose = require('mongoose');

let ReviewSchema = new mongoose.Schema({
    comment: String,
    rating:{
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = new mongoose.model("Review", ReviewSchema);