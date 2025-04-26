const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in!");
        res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async(req,res,next) => {
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateListing= (req, res, next) => {

    let schemaValidationResult = listingSchema.validate(req.body);
    console.log(schemaValidationResult);
    if (schemaValidationResult.error) {
        let errMsg = schemaValidationResult.error.details.map((el) => el.message).join(",");/*The map() function in JavaScript is used to create a new array by applying a callback function to each element of an existing array.*/

        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};


module.exports.validateReview= (req, res, next) => {

    let schemaValidationResult = reviewSchema.validate(req.body);
    console.log(schemaValidationResult);
    if (schemaValidationResult.error) {
        let errMsg = schemaValidationResult.error.details.map((el) => el.message).join(",");/*The map() function in JavaScript is used to create a new array by applying a callback function to each element of an existing array.*/

        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};
