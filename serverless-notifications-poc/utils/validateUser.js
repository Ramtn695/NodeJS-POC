const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  phone: Joi.string().required().min(10).max(10),
  place: Joi.string().required().min(2),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { userSchema, loginSchema };
