const Joi = require('joi');
const listing = require('./models/listings');

module.exports.listingSchema = Joi.object(
    {
            title: Joi.string().required().length(50),
            description: Joi.string().required().length(200),
            price: Joi.number().required().min(0).max(999999999999),
            location: Joi.string().required(),
            country: Joi.string().required(),
            owner: Joi.string(),
            image: Joi.string().allow("",null),
            country:Joi.string().required(),
        });

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment:Joi.string().required(),
        rating: Joi.number().min(1).max(5),
        createdAt:Joi.date()
    }).required()
});