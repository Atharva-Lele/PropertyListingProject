const express = require("express");
const router = express.Router();
const User = require("../models/user");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const flashSetter = require("../utils/flashSetter");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// passport.deserializeUser(function(id, done) {
//   User.findById(id).then( function (err, user) {
//     done(err, user);
//   });
// });

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then(function (user) {
      done(null, user); // First parameter is error (null = no error)
    })
    .catch(function (err) {
      done(err, null); // Pass the error as first parameter
    });
});

//login routes

router.get("/", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);

module.exports = router;
