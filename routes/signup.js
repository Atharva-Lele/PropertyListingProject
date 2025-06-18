const express = require("express");
const router = express.Router();
const User = require("../models/user");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const userController = require('../controller/userController')

//signup routes
router.get("/", userController.renderSignUp);

router.post("/", userController.signUp);

module.exports = router;
