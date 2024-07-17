const Joi = require('joi');

const updateUserSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  lastname: Joi.string().required(),
  role: Joi.string().required(),
});

module.exports = {
  updateUserSchema,
};
