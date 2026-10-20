const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const Listing = require("./models/listings.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
 

app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


main().then(()=>{
    console.log("conneceted to DB");
}).catch((err)=>console.log(err));

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

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
//validate error--->joi--------------->reviews
const validateReview = (req,res,err,next)=>{
    let {error}  = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//home route
app.get("/",(req,res)=>{
    console.log("hii i m root");
    res.send("i m roort");
});

//index route
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})

//new form route

app.get("/listings/new",(req,res)=>{
    res.render("./listings/form.ejs");
})
//show route

app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
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
app.post("/listings/new", validateListing,wrapAsync(async(req,res,next)=>{

        // if(!req.body.listing){
        //     throw new ExpressError(400,"send valid data for listings");
        // }.
        //joi error handling
    //    let result = listingSchema.validate(req.body);
        // console.log(result);
    //     if(result.error){
    //         throw new ExpressError(400,result.error);
    //     }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));

//Edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res,next)=>{
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
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


//creating reviews
//post review roue
app.post("/listings/:id/reviews", validateReview,wrapAsync(async(req,res)=>{
   let listing =  await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
//    listing.reviews.push(newReview);
   listing.reviews.push(newReview._id);
// console.log(newReview);
   await newReview.save();
   await listing.save();
   console.log("new review saved");
//    res.send("new review saved");                             

    res.redirect(`/listings/${listing._id}`);
}));


 //delete review route

 app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let{id ,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
 }))
 
 




// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"my new home", 
//         description:"good nature experiene connect to roots",
//         price:1200,
//         location:"bidar,karnatala",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("data saved");
//     res.send("data saved");
// })

 

//Craeting a error handling middleware
// app.use((err,req,res,next)=>{
//     res.send("something went wrong!!");
// })


app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
     
})

// Custom express error
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;

    // res.status(statusCode).send(message);
    res.status(statusCode).render("Error.ejs",{message});
});


app.listen(8080,()=>{
    console.log("app is listening at port 8080");
});


