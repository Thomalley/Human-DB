const { sign } = require('../../misc/utils/jwt');

const {
  OK,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CONFLICT,
  CREATED,
} = require('../../misc/const/http');

const {
  SUCCESS,
  FAILURE,
} = require('../../misc/const/response');

const {
  responseGenerator2,
} = require('../../misc/utils/http');

const {
  generateHash,
  compareHash,
} = require('../../misc/utils/bcrypt');

const {
  createNewUser,
  findUser,
} = require('./auth.services');

const CONTROLLER = 'auth.ctrl.js';
const FUNC_POST_LOGIN = 'postLogin()';
const FUNC_POST_REGISTER = 'postRegister()';

const postRegister = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Get data
  const {
    email,
    name,
    lastname,
    password,
    role,
  } = req.body;

  // Verify if user already exists
  let existingUser = null;
  try {
    const message = 'User already exists';
    existingUser = await findUser(app, { email: email.toLowerCase() });
    if (existingUser) {
      logger.warn(`${CONTROLLER}::${FUNC_POST_REGISTER}: ${message}`, {
        ...req.body,
      });
      responseGenerator2(res, CONFLICT.status, FAILURE, message);
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_REGISTER}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, 'Error de servidor');
    return;
  }

  const passwordHash = await generateHash(password);

  // Create new user
  let user = null;
  try {
    user = await createNewUser(app, {
      email: email.toLowerCase(),
      password: passwordHash,
      name,
      lastname,
      role,
    });
    responseGenerator2(res, CREATED.status, SUCCESS, '¡Usuario creado exitosamente!', user);
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_REGISTER}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, 'Hubo un error interno creando el usuario.');
  }
};

const postLogin = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Get data
  const {
    email,
    password,
  } = req.body;

  let token;
  const data = {};

  // Find user
  let user = null;
  try {
    user = await findUser(app, { email: email.toLowerCase() });
    if (!user) {
      logger.warn(`${CONTROLLER}::${FUNC_POST_LOGIN}: User does not exist`, {
        ...req.body,
      });
      responseGenerator2(res, NOT_FOUND.status, FAILURE, 'Credenciales incorrectas.', data);
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_LOGIN}: ${err.message}`, {
      ...req.body,
    });
    const message = 'Ha ocurrido un error interno al tratar de iniciar sesión.';
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, message);
    return;
  }

  // Compare passwords
  const match = await compareHash(password, user.password);
  if (!match) {
    const message = 'Contraseña incorrecta.';
    logger.warn(`${CONTROLLER}::${FUNC_POST_LOGIN}: ${message}`, {
      ...req.body,
    });
    responseGenerator2(res, CONFLICT.status, FAILURE, message, data);
    return;
  }

  // User exists and passwords match
  try {
    token = await sign(user);
    data.accessToken = token;
    data.user = user;
    const message = 'Credenciales correctas.';
    responseGenerator2(res, OK.status, SUCCESS, message, data);
  } catch (err) {
    const message = 'Hubo un problema generando el token de acceso, intenta nuevamente más tarde.';
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, message, data);
  }
};

module.exports = {
  postRegister,
  postLogin,
};
