const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },    //passport local mongoose adds an username and password , hash and salt field are created by default
});

userSchema.plugin(passportLocalMongoose); //automatically makes username, password, hashing, salt fields



module.exports = new mongoose.model('User', userSchema);