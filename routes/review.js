const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview= (req, res, next) => {


    let schemaValidationResult = reviewSchema.validate(req.body);
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


//Post Review Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();


    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewId",
    wrapAsync(async (req,res)=>{
        let {id,reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })
);

module.exports=router;