const Joi = require('joi');

const schema = Joi.object({

        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
                url: Joi.string().allow("", null).required(),
                filename: Joi.string().optional(),
            }).optional(),
        country: Joi.string().required(),
}).required();

module.exports.Listingschema = schema;

module.exports.reviewSchema = Joi.object({
        review: Joi.object({
                rating: Joi.number().required().min(1).max(5),
                comment: Joi.string().required(),
        }).required(),
});