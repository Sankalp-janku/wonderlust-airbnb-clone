const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const Listing = require("./models/listings.js")

app.set("view engine",ejs)
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); 

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


