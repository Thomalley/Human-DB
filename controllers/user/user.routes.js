const {
  getUsersPerPage,
  putUpdateUser,
  getCurrentUser,
  deleteUser,
  getUserById,
} = require('./user.ctrl');

const {
  putUserValidation,
} = require('./user.validations');

const { isAuthorized } = require('../auth/auth.middlewares');

module.exports = (app, router) => {
  // TODO: Actualizar permisos de rutas
  router.get('/users', isAuthorized(app), getUsersPerPage(app));
  router.put('/users/:id', isAuthorized(app), putUserValidation(app), putUpdateUser(app));
  router.get('/user', isAuthorized(app), getCurrentUser(app));
  router.get('/users/:id', isAuthorized(app), getUserById(app));
  router.delete('/users/:userIds', isAuthorized(app), deleteUser(app));
};
