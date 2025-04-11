const express = require("express");
const router = express.Router();
const User = require("../models/user");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const flashSetter = require("../utils/flashSetter");
//login routes

router.get("/", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: 'Invalid credentials',
  }),
  async (req, res) => {
    console.log("Req Handler");
    req.flash("success", `Welcome back ${req.session.passport.user}!`);
    console.log("Success message set: ");
    res.redirect("/listings");
    // res.send("You are logged in!");

  }
);

module.exports = router;
