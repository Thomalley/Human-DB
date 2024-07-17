const Joi = require('joi');

const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const registerSchema = Joi.object({
  email: Joi.string().min(3).max(255).pattern(new RegExp(re))
    .required(),
  name: Joi.string().min(2).max(255).required(),
  lastname: Joi.string().min(2).max(255).required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(3).max(255).pattern(new RegExp(re))
    .required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
