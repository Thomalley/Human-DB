const jwt = require('jsonwebtoken');

const sign = (user) => new Promise((resolve, reject) => {
  const secret = process.env.SECRET_TOKEN_KEY || '';

  if (secret === '') {
    reject(new Error('missing secret must have a value'));
    return;
  }

  let token;
  try {
    const data = {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
      user: {
        id: `${user.id}`,
        role: user.role,
      },
    };

    token = jwt.sign(data, secret);
  } catch (err) {
    reject(new Error(`failed to generate token: ${err}`));
    return;
  }

  resolve(token);
});

module.exports = {
  sign,
};
