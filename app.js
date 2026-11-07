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
const session = require("express-session");
const flash = require("connect-flash");

app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+3*24*60*60*1000,
        maxAge:3*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());

const listings = require("./routes/listing.js")
const routes = require("./routes/review.js")


main().then(()=>{
    console.log("conneceted to DB");
}).catch((err)=>console.log(err));

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
 //home route
app.get("/",(req,res)=>{
    console.log("hii i m root");
    res.send("i m roort");
});
app.use((req,res,next)=>{
    res.locals.sucess = req.flash("sucess");// its going to includes(flash.ejs)later included in boilerplate.ejs
    res.locals.delete = req.flash("delete")
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",routes);



 

 
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