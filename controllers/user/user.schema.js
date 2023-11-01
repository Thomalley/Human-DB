const Joi = require('joi');

const updateUserSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().min(2).max(255).required(),
  lastname: Joi.string().min(2).max(255).required(),
  active: Joi.boolean(),
});

module.exports = {
  updateUserSchema,
};
