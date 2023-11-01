const {
  CONFLICT, BAD_REQUEST,
} = require('../../misc/const/http');
const { FAILURE } = require('../../misc/const/response');

const {
  responseGenerator2,
} = require('../../misc/utils/http');

const {
  loginSchema,
  registerSchema,
} = require('./auth.schema');

const CONTROLLER = 'src/controllers/auth/auth.validations.js';
const FUNC_POST_REGISTER_VALIDATION = 'postRegisterValidation()';
const FUNC_POST_LOGIN_VALIDATION = 'postLoginValidation()';

const postRegisterValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await registerSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_POST_REGISTER_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    const message = 'Los datos ingresados no tienen formato correcto.';
    responseGenerator2(res, BAD_REQUEST.status, FAILURE, message);
    return;
  }

  next();
};

const postLoginValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await loginSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_POST_LOGIN_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator2(res, CONFLICT.status, FAILURE, err.message);
    return;
  }

  next();
};

module.exports = {
  postRegisterValidation,
  postLoginValidation,
};
