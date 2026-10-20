const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review  =require("./review.js");


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
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0hp7ACyquYmzqwA8vZQR8-AZos8UPhEY2hRzEV-Udrg&s=10",
        set: (v) =>
            v === ""
                ? "https://luxurystays.in/villas/sage/sage-4.jpg"
                : v
    }
},
    price:{
        type:Number,
        min:0
    },
    location:String,
    country:String,
    reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review"//model review is used
    }
    ]
});


//when deleting a listing Coreesponding review must be deleted

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
//model creation
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;