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

const CONTROLLER = 'src/controllers/user/user.ctrl.js';
const FUNC_GET_USERS_PAGE = 'getUsersPerPage()';
const FUNC_UPDATE_USER = 'putUpdateUser()';
const FUNC_GET_USER = 'getCurrentUser()';
const FUNC_GET_USER_BY_ID = 'getUserById()';
const FUNC_DELETE_USER = 'deleteUser()';

const getUsersPerPage = (app) => async (req, res) => {
  const { logger } = app.locals;

  const {
    limit, page, searchValue,
  } = req.query;

  try {
    const users = await findUsers(app, { limit, page, searchValue });

    if (!users.rows.length) {
      const message = 'No hay más usuarios.';
      responseGenerator2(res, NO_CONTENT.status, SUCCESS, message, {
        users: [],
        totalUsers: 0,
      });
      return;
    }

    const message = 'Usuarios encontrados.';
    responseGenerator2(
      res,
      OK.status,
      SUCCESS,
      message,
      {
        users: users.rows,
        totalUsers: users.count,
      },
    );
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USERS_PAGE}: ${err.message}`, {
      ...req.body,
    });
    const message = 'Ha ocurrido un error interno al buscar usuarios.';
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, message);
  }
};

const putUpdateUser = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { id } = req.params;
  const {
    name,
    lastname,
    active,
    role,
  } = req.body;

  try {
    // Verify required parameters
    if (!id) {
      logger.warn(`${CONTROLLER}::${FUNC_UPDATE_USER}: Missing parameters.`, {
        ...req.body,
      });
      const message = 'El id del usuario es requerido.';
      responseGenerator2(res, BAD_REQUEST.status, FAILURE, message);
      return;
    }

    const editedUser = await updateUser(app, {
      id,
      name,
      lastname,
      active,
      role,
    });

    if (!editedUser) {
      logger.warn(`${CONTROLLER}::${FUNC_UPDATE_USER}: User not edited.`, {
        ...req.body,
      });
      const message = 'No se ha podido editar al usuario.';
      responseGenerator2(res, BAD_REQUEST.status, FAILURE, message);
      return;
    }
    const message = 'Usuario editado correctamente.';
    responseGenerator2(res, OK.status, SUCCESS, message, editedUser);
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_UPDATE_USER}: ${err.message}`, {
      ...req.body,
    });
    const message = 'Ha ocurrido un error interno al editar al usuario.';
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, message);
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
      const message = 'Usuario no existe o ha sido eliminado.';
      responseGenerator2(res, NOT_FOUND.status, FAILURE, message);
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USER}: ${err.message}`, {
      ...req.body,
    });
    const message = 'Ha ocurrido un error interno al buscar al usuario actual.';
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, message);
    return;
  }

  const message = 'Usuario obtenido satisfactoriamente.';
  responseGenerator2(res, OK.status, SUCCESS, message, user);
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
      const message = 'Usuario no existe o fue eliminado.';
      responseGenerator2(res, NOT_FOUND.status, FAILURE, message);
      return;
    }
    const message = 'Usuario encontrado exitosamente.';
    responseGenerator2(res, OK.status, SUCCESS, message, user);
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USER_BY_ID}: ${err.message}`, {
      ...req.body,
    });
    const message = 'Ha ocurrido un error interno al buscar al usuario.';
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, message);
  }
};

const deleteUser = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { userIds } = req.params;

  try {
    const userIdsArray = userIds.split(',');
    for (let i = 0; i < userIdsArray.length; i += 1) {
      await deleteUserById(app, userIdsArray[i]);
    }

    const message = 'Usuarios eliminados satisfactoriamente.';
    responseGenerator2(res, OK.status, SUCCESS, message);
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_DELETE_USER}: ${err.message}`, {
      ...req.body,
    });
    const message = 'Ha ocurrido un error interno al eliminar el usuario.';
    responseGenerator2(res, INTERNAL_SERVER_ERROR.status, FAILURE, message);
  }
};

module.exports = {
  getUsersPerPage,
  putUpdateUser,
  getCurrentUser,
  deleteUser,
  getUserById,
};
