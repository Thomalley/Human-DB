const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../../misc/const/http');
const { FAILURE } = require('../../misc/const/response');
const { responseGenerator2 } = require('../../misc/utils/http');

const isAuthorized = (app, roles) => async (req, res, next) => {
  const bearerHeader = req.headers.authorization || null;
  if (!bearerHeader) {
    const message = 'Usuario no autorizado para hacer esta llamada.';
    responseGenerator2(res, UNAUTHORIZED.status, FAILURE, message);
    return;
  }
  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, data) => {
    if (err) {
      const message = 'Token no es válido.';
      responseGenerator2(res, UNAUTHORIZED.status, FAILURE, message);
      return;
    }

    // If the user's role is one of those in the array, the route can be used.
    const authorized = roles.includes(data.user.role);

    // If the user's role is not in the allowed array, the response is UNAUTHORIZED.
    if (!authorized) {
      const message = 'Usuario no autorizado para acceder a este recurso.';
      responseGenerator2(res, UNAUTHORIZED.status, FAILURE, message);
      return;
    }

    next();
  });
};

module.exports = {
  isAuthorized,
};
