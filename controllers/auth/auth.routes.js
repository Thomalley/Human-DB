const {
  postLoginValidation,
  postRegisterValidation,
} = require('./auth.validations');

const {
  postLogin,
  postRegister
} = require('./auth.ctrl');

const { isAuthorized } = require('./auth.middlewares');
const { ADMIN } = require("../../misc/const/roles")
module.exports = (app, router) => {
  router.post(
    '/login',
    postLoginValidation(app),
    postLogin(app)
  );

  router.post(
    '/register',
    isAuthorized(app, [ADMIN]),
    postRegisterValidation(app),
    postRegister(app)
  );
};
