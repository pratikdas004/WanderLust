const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// const listingSchema = new Schema({
//     title:{
//         type: String,
//         required:true,
//     },
//     description:String,
    // image:{
    //     type:String,
    //     default: "https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     set: (v) => 
    //         v === "" 
    //         ? "https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
    //         : v,
    // },
//     price:Number,
//     location:String,
//     country:String,
// });


const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  // image: {
  //   filename: String,
  //   url: String
  // },
  image: {
  //   filename:{
  //     type:String,
  //     default:"Filename",
  //   },
  //   url:{
  //   type: String,
  //   default:
  //     "https://pixabay.com/photos/coast-landscape-nature-ocean-sea-1867704/",
  //   set: (v) =>
  //     v === ""
  //       ? "https://pixabay.com/photos/coast-landscape-nature-ocean-sea-1867704/"
  //       : v,
  // }

  url: String,
  filename: String, 
},
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete",async (listing) =>{
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
  
});

const Listing = mongoose.model("listing",listingSchema);
module.exports = Listing;