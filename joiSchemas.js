import Joi from 'joi';

export const campgroundJoiSchema = Joi.object({
  campground: Joi.object({
    name: Joi.string()
      .required(),
    price: Joi.number()
      .min(0)
      .required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required()
  }).required()
});

export const reviewsJoiSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(0).max(5),
    body: Joi.string().required()
  }).required()
});