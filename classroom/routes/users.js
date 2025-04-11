const express = require('express');
const router = express.Router();

router.get("/", (req, res)=>{
    res.send("user get response");
})

router.get("/:id", (req, res)=>{
    res.send("user id response");
})

router.post("/", (req, res)=>{
    res.send("users post response");
})

module.exports = router;