import Joi from 'joi';

export const campgroundJoiSchema = Joi.object({
  campground: Joi.object({
    name: Joi.string()
      .alphanum()
      .required(),
    price: Joi.number()
      .min(0)
      .required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required()
  }).required()
});