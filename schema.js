const Joi = require('joi');
const Review = require('./models/review');

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.object({
            url : Joi.string().allow("",null),
            filename : Joi.string().allow("",null),
        }),
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required(),
    }).required()
});

const reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().min(1).max(5),
        comment : Joi.string().required()
    })
});

module.exports = {listingSchema , reviewSchema};