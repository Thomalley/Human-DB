const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Income extends Model {
    static associate(models) {
      Income.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Income.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: sequelize.DATEONLY,
      defaultValue: sequelize.fn('now'),
      field: "created_at",
    },
    updatedAt: {
      allowNull: false,
      type: sequelize.DATEONLY,
      defaultValue: sequelize.fn('now'),
      field: "updated_at",
    }
  }, {
    sequelize,
    modelName: 'Income',
    tableName: 'incomes',
  });
  return Income;
};