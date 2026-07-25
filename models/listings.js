const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//SChema Creation
const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,

    },
    // image:{
    //     default:"https://luxurystays.in/villas/sage/sage-4.jpg",
    //     set:(v)=>v===""?"https://luxurystays.in/villas/sage/sage-4.jpg":v,
    //     filename: String,
    //     url: String

    // },
    image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://luxurystays.in/villas/sage/sage-4.jpg",
        set: (v) =>
            v === ""
                ? "https://luxurystays.in/villas/sage/sage-4.jpg"
                : v
    }
},
    price:Number,
    location:String,
    country:String,
});

//model creation
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;