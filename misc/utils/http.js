const {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require('../const/http');

const responseGenerator2 = (response, status, success, message, data = null) => {
  switch (status) {
    // 2xx
    case OK.status: {
      const userData = {
        status,
        success,
        message: `${OK.message} - ${message}`,
        data,
      };

      response.status(OK.status)
        .json(userData);
      return;
    }

    case CREATED.status: {
      const userData = {
        status,
        success,
        message: `${CREATED.message} - ${message}`,
        data,
      };
      response.status(CREATED.status)
        .json(userData);
      return;
    }

    // 4xx
    case BAD_REQUEST.status: {
      const userData = {
        status,
        success,
        message: `${BAD_REQUEST.message} - ${message}`,
        data,
      };
      response.status(BAD_REQUEST.status)
        .json(userData);
      return;
    }

    case UNAUTHORIZED.status: {
      const userData = {
        status,
        success,
        message: `${UNAUTHORIZED.message} - ${message}`,
        data,
      };
      response.status(UNAUTHORIZED.status)
        .json(userData);
      return;
    }

    case FORBIDDEN.status: {
      const userData = {
        status,
        success,
        message: `${FORBIDDEN.message} - ${message}`,
        data,
      };
      response.status(FORBIDDEN.status)
        .json(userData);
      return;
    }

    case NOT_FOUND.status: {
      const userData = {
        status,
        success,
        message: `${NOT_FOUND.message} - ${message}`,
        data,
      };
      response.status(NOT_FOUND.status)
        .json(userData);
      return;
    }

    case CONFLICT.status: {
      const userData = {
        status,
        success,
        message: `${CONFLICT.message} - ${message}`,
        data,
      };
      response.status(CONFLICT.status)
        .json(userData);
      return;
    }

    // 5xx
    case INTERNAL_SERVER_ERROR.status: {
      const userData = {
        status,
        success,
        message: `${INTERNAL_SERVER_ERROR.message} - ${message}`,
        data,
      };
      response.status(INTERNAL_SERVER_ERROR.status)
        .json(userData);
      return;
    }

    default: {
      const userData = {
        status,
        success,
        message: `${INTERNAL_SERVER_ERROR.message} - ${message}`,
        data,
      };
      response.status(INTERNAL_SERVER_ERROR.status)
        .json(userData);
    }
  }
};

module.exports = {
  responseGenerator2,
};
