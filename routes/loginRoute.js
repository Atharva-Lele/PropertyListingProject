const express = require("express");
const router = express.Router();
const User = require("../models/user");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const flashSetter = require("../utils/flashSetter");
const { saveRedirectUrl } = require("../utils/middlewares");
const userController = require('../controller/userController');
//login routes

router.get("/", userController.renderLogin);

router.post(
  "/",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: 'Invalid credentials',
  }),
  userController.Login
);

module.exports = router;
