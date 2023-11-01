const createNewUser = async (app, {
  email,
  name,
  lastname,
  password,
  role,
  userTokenVerification,
}) => {
  const { db } = app.locals;

  const user = await db.user.create({
    email,
    name,
    lastname,
    password,
    role,
    userTokenVerification,
  });

  return user;
};

const findUser = async (app, {
  email,
}) => {
  const { db } = app.locals;

  const user = await db.user.findOne({
    where: {
      email,
    },
    attributes: { exclude: ['userTokenVerification', 'resetPasswordToken', 'createdAt', 'updatedAt', 'active'] },
  });
  return user;
};

module.exports = {
  createNewUser,
  findUser,
};
