const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const Listing = require("./models/listings.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


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

app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})

//Create route  
app.post("/listings/new",async(req,res)=>{
   const newListing =   new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings")
})

//Edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    res.render("./listings/edit.ejs",{listing});
});

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

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

 


app.listen(8080,()=>{
    console.log("app is listening at port 8080");
});


