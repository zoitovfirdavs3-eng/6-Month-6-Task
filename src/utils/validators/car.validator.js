const Joi = require("joi");

const carValidator = Joi.object({
  carname: Joi.string().trim().required().messages({
    "string.base": "Car name must be a string !",
    "string.empty": "Car name is required !",
    "any.required": "Car name is required !",
  }),

  category_id: Joi.string().required().messages({
    "string.base": "Car category must be a string !",
    "string.empty": "Car category is required !",
    "any.required": "Car category is required !",
  }),

  car_transmission_type: Joi.string().valid('automat', 'manual').required().messages({
    "string.base": "Transmission type must be a string!",
    "any.only": "Transmission type must be 'automat' or 'manual'!",
    "any.required": "Transmission type is required!",
    "string.empty": "Transmission type is required!"
  }),

  car_price: Joi.number().required().messages({
    "number.base": "Car price must be a number !",
    "any.required": "Car price is required !",
  }),
});

module.exports = carValidator;
