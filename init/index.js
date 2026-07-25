const mongoose= require("mongoose");
 const initData =require("./data.js");
const Listing = require("../models/listings.js");

main().then(()=>{
    console.log("conneceted to DB");
}).catch((err)=>console.log(err));

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}


const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();




//<li>description : <%= listing.description %></li>
       // <li> image : <%= listing.image.url %></li>
       // <li>price : <%= listing.price %></li>
      //  <li>location :<%= listing.location %></li>
       // <li> country :<%= listing.country %></li> 