const express = require("express");
const router =express.Router();

router.get("/",(req,res)=>{
    res.send("its post request ");
})
router.get("/:id",(req,res)=>{
    let {id} =req.params;
    res.send(`its post request" : ${id}"`);
})

module.exports =router;