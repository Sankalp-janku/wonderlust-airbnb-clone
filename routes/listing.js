const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const mongoose = require("mongoose");


//validate error--->joi:-------->listings
const validateListing = (req,res,err,next)=>{
    let {error}  = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//index route
router.get("/",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})

//new form route

router.get("/new",(req,res)=>{
    res.render("./listings/form.ejs");
})
//show route

router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    //Check for valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(404, "listing not found"));
    }

   const listing = await Listing.findById(id).populate("reviews");
   if (!listing) {
        return next(new ExpressError(404, "Listing not found"));
    }

    res.render("./listings/show.ejs",{listing});
}));

//Create route  
router.post("/new", validateListing,wrapAsync(async(req,res,next)=>{

        if(!req.body.listing){
            throw new ExpressError(400,"send valid data for listings");
        };
        // joi error handling;
       let result = listingSchema.validate(req.body);
        console.log(result);
        if(result.error){
            throw new ExpressError(400,result.error);
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    //CheCk for valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(404, "Listing not found"));
    }

    let listing = await Listing.findById(id);
      if (!listing) {
        return next(new ExpressError(404, "Listing not found"));
    }

    res.render("./listings/edit.ejs",{listing});
}));

//update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;