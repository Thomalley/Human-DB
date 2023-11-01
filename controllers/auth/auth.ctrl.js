const jwt = require('jsonwebtoken');
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

const CONTROLLER = 'src/controllers/auth/auth.ctrl.js';
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
    existingUser = await findUser(app, { email: email.toLowerCase() });
    if (existingUser) {
      logger.warn(`${CONTROLLER}::${FUNC_POST_REGISTER}: User already exists`, {
        ...req.body,
      });
      const message = 'User already exists';
      responseGenerator2(res, CONFLICT.status, FAILURE, message);
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_REGISTER}: ${err.message}`, {
      ...req.body,
    });
    const message = 'User already exists';
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, message);
    return;
  }

  // Hash password
  // En el caso que un usuario sea creado por un admin no tendrá password.
  const passwordHash = password ? await generateHash(password) : null;

  // Generate token
  const token = jwt.sign({
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    email,
  }, process.env.SECRET_TOKEN_KEY);

  // Create new user
  let user = null;
  try {
    user = await createNewUser(app, {
      email: email.toLowerCase(),
      password: passwordHash,
      name,
      lastname,
      role,
      userTokenVerification: token,
    });
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_REGISTER}: ${err.message}`, {
      ...req.body,
    });
    const message = 'Hubo un error interno creando el usuario.';
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, message);
    return;
  }

  const message = '¡Usuario creado exitosamente!';
  responseGenerator2(res, CREATED.status, SUCCESS, message, user);
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
      const message = 'Credenciales incorrectas.';
      responseGenerator2(res, NOT_FOUND.status, FAILURE, message, data);
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_LOGIN}: ${err.message}`, {
      ...req.body,
    });
    const message = 'Ha ocurrido un error interno al tratar de hacer ingreso.';
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
