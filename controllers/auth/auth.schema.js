const Joi = require('joi');

const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const registerSchema = Joi.object({
  email: Joi.string().pattern(new RegExp(re)).required(),
  name: Joi.string().required(),
  lastname: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(new RegExp(re)).required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
