const {
  postLoginValidation,
  postRegisterValidation,
} = require('./auth.validations');

const {
  postLogin,
  postRegister
} = require('./auth.ctrl');

const { isAuthorized } = require('./auth.middlewares');

module.exports = (app, router) => {
  router.post('/login', postLoginValidation(app), postLogin(app));
  router.post('/register', postRegisterValidation(app), isAuthorized(app), postRegister(app));
};
