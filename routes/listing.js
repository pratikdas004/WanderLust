const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");



const validateListing= (req, res, next) => {


    let schemaValidationResult = listingSchema.validate(req.body);
    console.log(schemaValidationResult);
    /*"On calling the validate function of the Joi schema object, it returns a 
    result object. If the error key in this object contains a message, it indicates 
    that there is a schema validation error."*/
    if (schemaValidationResult.error) {
        let errMsg = schemaValidationResult.error.details.map((el) => el.message).join(",");/*The map() function in JavaScript is used to create a new array by applying a callback function to each element of an existing array.*/

        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};

//Index Route
router.get("/",wrapAsync(async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//Create Route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing= new Listing( req.body.listing);
    await newListing.save();
    res.redirect("/listings");

}));

//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
    
}));

module.exports = router;