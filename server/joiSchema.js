const Joi = require("joi");

module.exports.userSchema = Joi.object({
    name:Joi.string().pattern(/^[A-Za-z]+$/).required(),
    email:Joi.string().email().required(),
    password:Joi.string().alphanum().required(),
    phone:Joi.number().required(),
    address:Joi.string().required(),
    role:Joi.string().valid("customer","restaurant","agent").default("customer").required()
});


module.exports.restaurantSchema = Joi.object({
    name:Joi.string().pattern(/^[A-Za-z]+$/).required(),
    address:Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required()
});

module.exports.menuSchema = Joi.object({
     name: Joi.string().required(),

    description: Joi.string().allow(""),

    price: Joi.number()
        .min(0)
        .required(),

    category: Joi.string().required()
});

module.exports.orderSchema = Joi.object({
    restaurant: Joi.string().hex().length(24).required(),
    items: Joi.array().items(
        Joi.object({
          menuItem:Joi.string().hex().length(24).required(),
          quantity:Joi.number().min(1).required(),
          price:Joi.number().min(1).required()
    })),
    totalAmt:Joi.number().required(),
    deliveryAdd:Joi.string().min(5).required()
});