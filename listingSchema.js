const Joi = require('joi');
const listing = require('./models/listings');

module.exports.listingSchema = Joi.object(
    {
        listing:Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required().min(0),
            location: Joi.string().required(),
            image: Joi.string().allow("",null),
            country:Joi.string().required()
        })
    }
);