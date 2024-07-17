const sequelize = require('sequelize');

const op = sequelize.Op;

const findUserById = async (app, {
  id,
}) => {
  const { db } = app.locals;

  const user = await db.User.findOne({
    where: {
      id,
    },
    attributes: ['id', 'email', 'role', 'name', 'lastname', 'active'],
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

  if (!!searchValue && searchValue !== '') {
    whereUser.name = {
      [op.iLike]: `%${searchValue}%`,
    };
  }

  const users = await db.User.findAndCountAll({
    offset: limit * page,
    limit: Number.parseInt(limit, 10),
    where: whereUser,
    attributes: ['id', 'name', 'lastname', 'email', 'role', 'lastConnection'],
    order: [['name', 'ASC']],
  });

  return users;
};

const updateUser = async (app, {
  id,
  name,
  lastname,
  active,
  role,
}) => {
  const { db } = app.locals;

  const user = await db.User.findByPk(id);

  if (user) {
    await user.update({
      name,
      lastname,
      active,
      role,
    });
  }

  return user;
};

const deleteUserById = async (app, id) => {
  const { db } = app.locals;

  await db.user.destroy({
    where: {
      id,
    },
  });

  return null;
};

module.exports = {
  findUserById,
  findUsers,
  updateUser,
  deleteUserById,
};
