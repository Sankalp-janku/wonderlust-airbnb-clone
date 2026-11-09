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
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");


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

app.use(passport.initialize());
app.use(passport.initialize());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStratergy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


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

// flash notifications
app.use((req,res,next)=>{
    res.locals.sucess = req.flash("sucess");// its going to includes(flash.ejs)later included in boilerplate.ejs
    res.locals.delete = req.flash("delete");
    res.locals.click = req.flash("click");
    next();
})

app.get("/demoUser",async (req,res)=>{
    let fakeUser = new User({
        email:"student@gmail.com",
        username:"delta-student"
    });
    let registeredUser = await User.register(fakeUser,"helloworld");
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



 

 
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