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
 
const listings = require("./routes/listing.js")
const routes = require("./routes/review.js")

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

// //validate error--->joi:-------->listings
// const validateListing = (req,res,err,next)=>{
//     let {error}  = listingSchema.validate(req.body);

//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",")
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
// }
// //validate error--->joi--------------->reviews
// const validateReview = (req,res,err,next)=>{
//     let {error}  = reviewSchema.validate(req.body);

//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",")
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
// }

app.use("/listings",listings);
app.use("/listings/:id/reviews",routes);

//home route
app.get("/",(req,res)=>{
    console.log("hii i m root");
    res.send("i m roort");
});

 

//creating reviews
//post review roue
// app.post("/listings/:id/reviews", validateReview,wrapAsync(async(req,res)=>{
//    let listing =  await Listing.findById(req.params.id);
//    let newReview = new Review(req.body.review);
// //    listing.reviews.push(newReview);
//    listing.reviews.push(newReview._id);
// // console.log(newReview);
//    await newReview.save();
//    await listing.save();
//    console.log("new review saved");
// //    res.send("new review saved");                             

//     res.redirect(`/listings/${listing._id}`);
// }));


//  //delete review route

//  app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
//     let{id ,reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`)
//  }))
 
 




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