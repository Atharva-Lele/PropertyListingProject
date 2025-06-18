const express = require("express");
const router = express.Router();
const userController = require('../controller/userController')

//signup routes
router.get("/", userController.logout);

module.exports = router;