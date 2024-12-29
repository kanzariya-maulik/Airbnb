const Joi = require('joi');
const listing = require('./models/listings');

module.exports.listingSchema = Joi.object(
    {
            title: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required().min(0),
            location: Joi.string().required(),
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