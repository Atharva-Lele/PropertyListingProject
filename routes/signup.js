const express = require("express");
const router = express.Router();
const User = require("../models/user");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");


//signup routes
router.get("/", (req, res) => {
  res.render("signup.ejs");
});

router.post("/", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    // console.log(username+email+password);
    let newUser = new User({ email, username });
    let regedUser = await User.register(newUser, password);
    if (!regedUser) {
      req.flash("error", "Signup Failed");
      res.redirect("/signup");
    } else {
      req.flash("success", "Registered");
      res.redirect("/listings");
    }
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
    
  }
});

module.exports = router;
