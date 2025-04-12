const express = require("express");
const router = express.Router();
const User = require("../models/user");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const flashSetter = require("../utils/flashSetter");
const { saveRedirectUrl } = require("../utils/middlewares");
//login routes

router.get("/", (req, res) => {
  if(req.isAuthenticated()){
    req.flash("error", "You are already logged in, logout first");
    res.redirect('/listings');
  }
  else{
    // console.log(req.headers.referer.slice(21)); //change when deploying, 21 is for localhost
    res.locals.referUrl = req.headers.referer.slice(21); 
  }
  res.render("login.ejs");
});

router.post(
  "/",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: 'Invalid credentials',
  }),
  async (req, res) => {
    console.log("Req Handler");
    req.flash("success", `Welcome back ${req.session.passport.user}!`);
    console.log("Success message set: ");
    res.redirect(res.locals.redirectUrl || '/listings');
    // res.send("You are logged in!");

  }
);

module.exports = router;
