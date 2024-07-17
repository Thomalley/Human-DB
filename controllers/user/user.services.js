const sequelize = require('sequelize');

const op = sequelize.Op;

const findUserById = async (app, { id }) => {
  const { db } = app.locals;

  const user = await db.User.findOne({
    where: { id },
    attributes: ['id', 'email', 'role', 'name', 'lastname'],
  });

  return user;
};

const findUsers = async (app, {
  limit,
  page,
  searchValue,
}) => {
  const { db } = app.locals;
  const whereUser = {};
  const fixedLimit = parseInt(limit, 10);
  const fixedPage = parseInt(page, 10);
  if (searchValue) {
    whereUser.name = {
      [op.iLike]: `%${searchValue}%`,
    };
  }

  const users = await db.User.findAndCountAll({
    offset: fixedLimit * fixedPage,
    limit: fixedLimit,
    where: whereUser,
    attributes: ['id', 'name', 'lastname', 'email', 'role'],
    order: [['name', 'ASC']],
  });

  return users;
};

const updateUser = async (app, {
  id,
  name,
  lastname,
  role,
}) => {
  const { db } = app.locals;

  const user = await db.User.findByPk(id);

  if (user) {
    await user.update({
      name,
      lastname,
      role,
    });
  }

  return user;
};

const deleteUserById = async (app, ids) => {
  const { db } = app.locals;

  await db.user.destroy({
    where: { [op.in]: ids },
  });

  return null;
};

module.exports = {
  findUserById,
  findUsers,
  updateUser,
  deleteUserById,
};
