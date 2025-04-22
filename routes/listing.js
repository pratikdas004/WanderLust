const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");


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
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(! listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}));

//Create Route
router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
    const newListing= new Listing( req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing created!!");
    res.redirect("/listings");

}));

//Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(! listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
    
}));

module.exports = router;