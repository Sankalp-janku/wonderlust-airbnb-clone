const express = require("express");
const router =express.Router();

router.get("/",(req,res)=>{
    res.send("its user request ");
})
router.get("/:id",(req,res)=>{
    let {id} =req.params;
    res.send(`its user request" : ${id}"`);
})

module.exports =router;