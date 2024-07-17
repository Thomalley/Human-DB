/* eslint-disable no-await-in-loop */
const {
  INTERNAL_SERVER_ERROR, NO_CONTENT, OK, BAD_REQUEST, NOT_FOUND,
} = require('../../misc/const/http');

const {
  responseGenerator2,
} = require('../../misc/utils/http');

const {
  SUCCESS,
  FAILURE,
} = require('../../misc/const/response');

const {
  findUserById,
  findUsers,
  updateUser,
  deleteUserById,
} = require('./user.services');

const CONTROLLER = 'user.ctrl.js';
const FUNC_GET_USERS_PAGE = 'getUsersPerPage()';
const FUNC_UPDATE_USER = 'putUpdateUser()';
const FUNC_GET_USER = 'getCurrentUser()';
const FUNC_GET_USER_BY_ID = 'getUserById()';
const FUNC_DELETE_USER = 'deleteUser()';

const getUsersPerPage = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { limit, page, searchValue } = req.query;

  try {
    const users = await findUsers(app, { limit, page, searchValue });
    if (!users.rows.length) {
      responseGenerator2(res, NO_CONTENT.status, SUCCESS, 'No hay más usuarios.', {
        users: [],
        totalUsers: 0,
      });
      return;
    }

    responseGenerator2(
      res,
      OK.status,
      SUCCESS,
      'Usuarios encontrados.',
      {
        users: users.rows,
        totalUsers: users.count,
      },
    );
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USERS_PAGE}: ${err.message}`, { ...req.body });
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, 'Ha ocurrido un error interno al buscar usuarios.');
  }
};

const putUpdateUser = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { id } = req.params;
  const { name, lastname, role } = req.body;

  try {
    // Verify required parameters
    if (!id) {
      logger.warn(`${CONTROLLER}::${FUNC_UPDATE_USER}: Missing parameters.`, {
        ...req.body,
      });
      responseGenerator2(res, BAD_REQUEST.status, FAILURE, 'El id del usuario es requerido.');
      return;
    }

    const editedUser = await updateUser(app, {
      id,
      name,
      lastname,
      role,
    });

    if (!editedUser) {
      logger.warn(`${CONTROLLER}::${FUNC_UPDATE_USER}: User not edited.`, {
        ...req.body,
      });
      responseGenerator2(res, BAD_REQUEST.status, FAILURE, 'No se ha podido editar al usuario.');
      return;
    }
    responseGenerator2(res, OK.status, SUCCESS, 'Usuario editado correctamente.', editedUser);
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_UPDATE_USER}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, 'Ha ocurrido un error interno al editar al usuario.');
  }
};

const getCurrentUser = (app) => async (req, res) => {
  const { logger } = app.locals;
  // Get data
  const { userId } = res.locals;

  // Find user
  let user = null;
  try {
    user = await findUserById(app, { id: userId });
    if (!user) {
      logger.warn(`${CONTROLLER}::${FUNC_GET_USER}: User does not exist`, {
        ...req.body,
      });
      responseGenerator2(res, NOT_FOUND.status, FAILURE, 'Usuario no existe o ha sido eliminado.');
      return;
    }
    responseGenerator2(res, OK.status, SUCCESS, 'Usuario obtenido satisfactoriamente.', user);
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USER}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, 'Ha ocurrido un error interno al buscar al usuario actual.');
  }
};

const getUserById = (app) => async (req, res) => {
  const { logger } = app.locals;
  // Get data
  const { id } = req.params;

  // Find user
  let user = null;
  try {
    user = await findUserById(app, { id });
    if (!user) {
      logger.warn(`${CONTROLLER}::${FUNC_GET_USER_BY_ID}: User does not exist`, {
        ...req.body,
      });
      responseGenerator2(res, NOT_FOUND.status, FAILURE, 'Usuario no existe o fue eliminado.');
      return;
    }
    responseGenerator2(res, OK.status, SUCCESS, 'Usuario encontrado exitosamente.', user);
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USER_BY_ID}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, 'Ha ocurrido un error interno al buscar al usuario.');
  }
};

const deleteUser = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { userIds } = req.params;

  try {
    const userIdsArray = userIds.split(',');
    await deleteUserById(app, userIdsArray);

    responseGenerator2(res, OK.status, SUCCESS, 'Usuarios eliminados satisfactoriamente.');
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_DELETE_USER}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, 'Ha ocurrido un error interno al eliminar el usuario.');
  }
};

module.exports = {
  getUsersPerPage,
  putUpdateUser,
  getCurrentUser,
  deleteUser,
  getUserById,
};
