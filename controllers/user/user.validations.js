const {
  BAD_REQUEST,
} = require('../../misc/const/http');
const { FAILURE } = require('../../misc/const/response');

const {
  responseGenerator2,
} = require('../../misc/utils/http');

const {
  updateUserSchema,
} = require('./user.schema');

const CONTROLLER = 'user.validations.js';
const FUNC_PUT_USER_VALIDATION = 'putUserValidation()';

const putUserValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;
  const { id } = req.params;

  try {
    await updateUserSchema.validateAsync({ id, ...req.body });
    next();
  } catch (err) {
    logger.warn(`${CONTROLLER}:: ${FUNC_PUT_USER_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    const message = 'Los datos ingresados no tienen formato correcto.';
    responseGenerator2(res, BAD_REQUEST.status, FAILURE, message);
  }
};

module.exports = {
  putUserValidation,
};
