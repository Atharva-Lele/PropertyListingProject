const express = require('express');
const router = express.Router();

router.get("/",  (req, res)=>{
    res.send("Posts get  response");
})

router.get("/:id", (req, res)=>{
    res.send("posts id get response");
})

router.post("/", (req, res)=>{
    res.send("post post response");
})

module.exports = router;