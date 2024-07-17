const {
  getUsersPerPage,
  putUpdateUser,
  getCurrentUser,
  deleteUser,
  getUserById,
} = require('./user.ctrl');

const { putUserValidation } = require('./user.validations');

const { isAuthorized } = require('../auth/auth.middlewares');
const { ADMIN } = require('../../misc/const/roles');

module.exports = (app, router) => {
  router.get('/users', isAuthorized(app, [ADMIN]), getUsersPerPage(app));
  router.put('/users/:id', isAuthorized(app, [ADMIN]), putUserValidation(app), putUpdateUser(app));
  router.get('/user', isAuthorized(app, [ADMIN]), getCurrentUser(app));
  router.get('/users/:id', isAuthorized(app, [ADMIN]), getUserById(app));
  router.delete('/users/:userIds', isAuthorized(app, [ADMIN]), deleteUser(app));
};
