const createNewUser = async (app, {
  email,
  name,
  lastname,
  password,
  role,
  userTokenVerification,
}) => {
  const { db } = app.locals;

  const user = await db.User.create({
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

  const user = await db.User.findOne({
    where: {
      email,
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  return user;
};

module.exports = {
  createNewUser,
  findUser,
};
