const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsToMany(models.User, {
        through: models.ExpenseUser,
        foreignKey: 'expenseId',
      });
      Expense.belongsToMany(models.PaymentMethod, {
        through: models.ExpensePayment,
        foreignKey: 'expenseId',
      });
    }
  }
  Expense.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: sequelize.fn('now'),
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    montlhy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: sequelize.DATE,
      defaultValue: sequelize.fn('now'),
      field: "created_at",
    },
    updatedAt: {
      allowNull: false,
      type: sequelize.DATE,
      defaultValue: sequelize.fn('now'),
      field: "updated_at",
    }
  }, {
    sequelize,
    modelName: 'Expense',
    tableName: 'expenses',
  });
  return Expense;
};